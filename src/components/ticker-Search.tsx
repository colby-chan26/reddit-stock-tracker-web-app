'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { tickerSearch } from '@/actions/search';

type SearchQuote = {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchDisp?: string;
  quoteType?: string;
};

const DEBOUNCE_MS = 500;

export const TickerSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      const requestId = latestRequestIdRef.current + 1;
      latestRequestIdRef.current = requestId;
      setIsLoading(true);

      try {
        const data = await tickerSearch(trimmedQuery);
        const quotes = (data.quotes ?? [])
          .filter((v) => !!v.symbol && v.isYahooFinance)
          .map((quote) => ({
            symbol: quote.symbol,
            shortname: quote.shortname,
            longname: quote.longname,
            exchDisp: quote.exchDisp,
            quoteType: quote.quoteType,
          })) as SearchQuote[];

        if (requestId !== latestRequestIdRef.current) {
          throw new Error('old quote');
        }

        setResults(quotes);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className='relative w-64'>
      <Input
        type='search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        placeholder='Search ticker...'
      />

      {isInputFocused && query.trim() && (
        <div className='absolute top-full mt-1 w-full rounded-md border bg-background shadow-md z-50'>
          {isLoading ? (
            <div className='p-2 text-sm text-muted-foreground'>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul onMouseDown={(e) => e.preventDefault()}>
              {results.map((result) => (
                <a
                  key={`${result.symbol}-${result.quoteType ?? 'unknown'}`}
                  href={`/ticker/${result.symbol}${result.exchDisp ? `?exchange=${result.exchDisp}` : ''}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <li className='p-2 border-b last:border-b-0 text-sm cursor-pointer hover:bg-accent transition-colors'>
                    <div className='font-medium'>{result.symbol}</div>
                    <div className='text-muted-foreground truncate'>
                      {result.shortname ?? result.longname ?? 'Unknown name'}
                    </div>
                  </li>
                </a>
              ))}
            </ul>
          ) : (
            <div className='p-2 text-sm text-muted-foreground'>No results</div>
          )}
        </div>
      )}
    </div>
  );
};

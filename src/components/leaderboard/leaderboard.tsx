'use client';

import { useState } from 'react';
import SymbolInfo from '@/components/trading-view/symbol-info';
import SymbolOverview from '@/components/trading-view/symbol-overview';
import { GlobeIcon, LinkIcon } from 'lucide-react';
import type { LeaderboardStock } from '@/actions/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '../ui/badge';

type Props = {
  stocks: LeaderboardStock[];
};

export default function Leaderboard({ stocks }: Props) {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);

  return (
    <div className='grow flex flex-row font-sans gap-2 overflow-hidden'>
      <div className='w-[40%] h-full pb-5'>
        <Card className='w-full h-full'>
          <CardHeader>
            <CardTitle>Reddit Stock Leaderboard</CardTitle>
            <CardDescription>
              Based on my collected Reddit data, ranked by sum of all post upvotes mentioning the stock
            </CardDescription>
          </CardHeader>
          <CardContent className='min-h-0 overflow-y-auto'>
            <Accordion type='single' collapsible defaultValue='plans'>
              {stocks.map((stock, index) => (
                <AccordionItem key={stock.name} value={stock.ticker}>
                  <AccordionTrigger onClick={() => setSelectedStock(stock)}>
                    <span className='flex items-center'>
                      <span className='bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2'>
                        {index + 1}
                      </span>
                      {stock.name}
                    </span>
                    <span className='text-muted-foreground text-sm ml-auto mr-2'>
                      {stock.score?.toLocaleString()}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='flex w-full flex-wrap gap-2 pb-3'>
                      <Badge>{stock.industry}</Badge>
                      <Badge variant='secondary'>{stock.sector}</Badge>
                    </div>
                    <div className='grid grid-cols-[auto_1fr] gap-2 pb-3'>
                      <GlobeIcon />
                      <div>
                        {stock.city}, {stock.country}
                      </div>
                      <LinkIcon />
                      <a
                        className='text-primary hover:underline'
                        href={stock.website}
                        target='_blank'
                      >
                        {stock.website}
                      </a>
                    </div>
                    {stock.summary}
                    {stock.earliest_post && (
                      <div className='text-xs text-muted-foreground pt-3'>
                        First Collected Post:{' '}
                        {new Date(stock.earliest_post).toLocaleDateString()}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className='grow flex flex-col xl:max-w-[70%] max-w-[60%] min-w-[50%]'>
        <div>
          <SymbolInfo
            name={selectedStock.name ?? ''}
            ticker={selectedStock.ticker}
          />
        </div>
        <div className='grow h-[80%]'>
          <SymbolOverview
            symbols={[
              {
                name: selectedStock.name ?? '',
                ticker: selectedStock.ticker,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

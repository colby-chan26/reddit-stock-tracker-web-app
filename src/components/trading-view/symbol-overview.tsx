'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

export interface TickerSymbol {
  name: string;
  ticker: string;
}

interface TradingViewWidgetProps {
  symbols: TickerSymbol[];
}

// Generate copyright links dynamically
const CopyrightLink = ({ symbols }: { symbols: TickerSymbol[] }) => {
  return symbols.map((s, index) => {
    const isLast = index === symbols.length - 1;
    const isSecondToLast = index === symbols.length - 2;

    return (
      <span key={s.ticker}>
        <a
          href={`https://www.tradingview.com/symbols/${s.ticker.toUpperCase()}/`}
          rel='noopener nofollow'
          target='_blank'
        >
          <span className='blue-text'>
            {isLast ? `${s.name} stock price` : s.name}
          </span>
        </a>
        {!isLast && (
          <>
            {isSecondToLast ? (
              <span className='and'>&nbsp;and&nbsp;</span>
            ) : (
              <span className='comma'>,&nbsp;</span>
            )}
          </>
        )}
      </span>
    );
  });
};

function SymbolOverview({ symbols }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer || symbols.length === 0) return;

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;

    // Convert symbols to TradingView format
    const formattedSymbols = symbols.map((s) => [
      s.name,
      s.ticker.toUpperCase(),
    ]);

    script.innerHTML = JSON.stringify({
      lineWidth: 2,
      lineType: 0,
      chartType: 'area',
      fontColor: 'rgb(106, 109, 120)',
      gridLineColor:
        resolvedTheme === 'light'
          ? 'rgba(46, 46, 46, 0.06)'
          : 'rgba(242, 242, 242, 0.06)',
      volumeUpColor: 'rgba(34, 171, 148, 0.5)',
      volumeDownColor: 'rgba(247, 82, 95, 0.5)',
      backgroundColor: resolvedTheme === 'light' ? '#ffffff' : '#1f1f1f',
      widgetFontColor: resolvedTheme === 'light' ? '#0F0F0F' : '#DBDBDB',
      upColor: '#22ab94',
      downColor: '#f7525f',
      borderUpColor: '#22ab94',
      borderDownColor: '#f7525f',
      wickUpColor: '#22ab94',
      wickDownColor: '#f7525f',
      colorTheme: resolvedTheme,
      isTransparent: false,
      locale: 'en',
      chartOnly: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      symbols: formattedSymbols,
      dateRanges: [
        '1d|1',
        '1w|15',
        '1m|30',
        '3m|60',
        '12m|1D',
        '60m|1W',
        'all|1M',
      ],
      fontSize: '10',
      headerFontSize: 'medium',
      autosize: true,
      width: '100%',
      height: '100%',
      noTimeScale: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
    });

    currentContainer.prepend(script);

    // Cleanup on unmount or when symbols change
    return () => {
      currentContainer.innerHTML = '';
    };
  }, [resolvedTheme, symbols]);

  return (
    <div className='h-[calc(100%-40px)]'>
      <div className='tradingview-widget-container' ref={container}>
        <div className='tradingview-widget-container__widget' />
      </div>
      <div className='tradingview-widget-copyright'>
        <CopyrightLink symbols={symbols} />
        <span className='trademark'>&nbsp;by TradingView</span>
      </div>
    </div>
  );
}

export default memo(SymbolOverview);

'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

export interface TimelineProps {
  ticker: string;
  exchange?: string;
}

function Timeline({ ticker, exchange }: TimelineProps) {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer || !ticker) return;

    const symbol = exchange
      ? `${exchange.toUpperCase()}:${ticker.toUpperCase()}`
      : ticker.toUpperCase();

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.type = 'text/javascript';
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbol,
      colorTheme: resolvedTheme,
      displayMode: 'regular',
      feedMode: 'symbol',
      isTransparent: false,
      locale: 'en',
      width: '100%',
      height: '100%',
    });

    currentContainer.prepend(script);

    // Cleanup on unmount or when ticker/theme changes
    return () => {
      currentContainer.innerHTML = '';
    };
  }, [resolvedTheme, ticker, exchange]);

  return (
    <div
      className='tradingview-widget-container rounded-[3px] overflow-hidden h-full'
      ref={container}
    >
      <div className='tradingview-widget-container__widget'></div>
    </div>
  );
}

export default memo(Timeline);

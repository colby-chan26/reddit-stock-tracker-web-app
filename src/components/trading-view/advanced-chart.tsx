'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

export interface AdvancedChartProps {
  ticker: string;
}

function AdvancedChart({ ticker }: AdvancedChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer || !ticker) return;

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbol: ticker.toUpperCase(),
      theme: resolvedTheme,
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: 'D',
      locale: 'en',
      save_image: true,
      style: '1',
      timezone: 'Etc/UTC',
      backgroundColor: resolvedTheme === 'light' ? '#ffffff' : '#0F0F0F',
      gridColor:
        resolvedTheme === 'light'
          ? 'rgba(46, 46, 46, 0.06)'
          : 'rgba(242, 242, 242, 0.06)',
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true,
    });

    currentContainer.prepend(script);

    // Cleanup on unmount or when ticker/theme changes
    return () => {
      currentContainer.innerHTML = '';
    };
  }, [resolvedTheme, ticker]);

  return (
    <div
      className='tradingview-widget-container rounded-[3px] overflow-hidden h-full w-full'
      ref={container}
    >
      <div className='tradingview-widget-container__widget h-full w-full'></div>
    </div>
  );
}

export default memo(AdvancedChart);

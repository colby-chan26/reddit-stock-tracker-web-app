'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

function HeatMap() {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.type = 'text/javascript';
    script.async = true;

    script.innerHTML = JSON.stringify({
      dataSource: 'SPX500',
      blockSize: 'market_cap_basic',
      blockColor: 'change',
      grouping: 'sector',
      locale: 'en',
      symbolUrl: '',
      colorTheme: resolvedTheme,
      exchanges: [],
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: false,
      width: '100%',
      height: '100%',
    });

    currentContainer.prepend(script);

    // Cleanup on unmount or when theme changes
    return () => {
      currentContainer.innerHTML = '';
    };
  }, [resolvedTheme]);

  return (
    <div className='h-[calc(100%-40px)]'>
      <div className='tradingview-widget-container rounded-[3px] overflow-hidden' ref={container}>
        <div className='tradingview-widget-container__widget' />
      </div>
       <div className='tradingview-widget-copyright'>
          <a
            href='https://www.tradingview.com/heatmap/stock/'
            rel='noopener nofollow'
            target='_blank'
          >
            <span className='blue-text'>Stock Heatmap</span>
          </a>
          <span className='trademark'>&nbsp;by TradingView</span>
        </div>
    </div>
  );
}

export default memo(HeatMap);

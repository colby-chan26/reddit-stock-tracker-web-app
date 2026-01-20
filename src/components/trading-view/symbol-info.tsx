'use client';

import { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

export interface SymbolInfoProps {
  ticker: string;
  name: string;
}

function SymbolInfo({ ticker, name }: SymbolInfoProps) {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer || !ticker) return;

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    script.type = 'text/javascript';
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbol: ticker.toUpperCase(),
      colorTheme: resolvedTheme,
      isTransparent: false,
      locale: 'en',
      width: '100%',
    });

    currentContainer.prepend(script);
    
    // Cleanup on unmount or when ticker/theme changes
    return () => {
      currentContainer.innerHTML = '';
    };
  }, [resolvedTheme, ticker]);

  return (
    <>
      <div className='tradingview-widget-container rounded-[3px] overflow-hidden' ref={container}>
        <div className='tradingview-widget-container__widget'></div>
      </div>
      <div className='tradingview-widget-copyright'>
        <a
          href={`https://www.tradingview.com/symbols/${ticker.toUpperCase()}/`}
          rel='noopener nofollow'
          target='_blank'
        >
          <span className='blue-text'>{name} performance</span>
        </a>
        <span className='trademark'>&nbsp;by TradingView</span>
      </div>
    </>
  );
}

export default memo(SymbolInfo);

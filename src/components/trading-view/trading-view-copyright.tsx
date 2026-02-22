'use client';

import { memo } from 'react';

export interface TradingViewCopyrightProps {
  href: string;
  linkText: string;
}

function TradingViewCopyright({ href, linkText }: TradingViewCopyrightProps) {
  return (
    <div className='tradingview-widget-copyright'>
      <a href={href} rel='noopener nofollow' target='_blank'>
        <span className='blue-text'>{linkText}</span>
      </a>
      <span className='trademark'>&nbsp;by TradingView</span>
    </div>
  );
}

export default memo(TradingViewCopyright);

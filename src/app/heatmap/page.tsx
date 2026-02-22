import HeatMap from '@/components/trading-view/heat-map';
import TradingViewCopyright from '@/components/trading-view/trading-view-copyright';
import React from 'react';

export const HeatMapPage = () => {
  return (
    <div className='h-full flex flex-col'>
      <div className='grow'>
        <HeatMap />
      </div>
      <TradingViewCopyright
        href='https://www.tradingview.com/heatmap/stock/'
        linkText='Stock Heatmap'
      />
    </div>
  );
};

export default HeatMapPage;

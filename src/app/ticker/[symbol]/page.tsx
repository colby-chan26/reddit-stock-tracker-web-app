import AdvancedChart from '@/components/trading-view/advanced-chart';
import FundamentalData from '@/components/trading-view/fundamental-data';
import SymbolInfo from '@/components/trading-view/symbol-info';
import Timeline from '@/components/trading-view/timeline';
import TradingViewCopyright from '@/components/trading-view/trading-view-copyright';

interface TickerPageProps {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ exchange?: string }>;
}

export default async function TickerPage({
  params,
  searchParams,
}: TickerPageProps) {
  const { symbol } = await params;
  const { exchange } = await searchParams;
  const ticker = symbol.toUpperCase();

  return (
    <div className='flex flex-col h-full w-full p-4 gap-2'>
      <div className='shrink-0'>
        <SymbolInfo ticker={ticker} name={ticker} />
      </div>

      <div className='flex-1 grid grid-cols-3 gap-2 min-h-0'>
        <div className='col-span-2 h-full'>
          <AdvancedChart ticker={ticker} />
        </div>

        <div className='col-span-1 flex flex-col gap-2 h-full'>
          <div className='flex-1 min-h-0'>
            <FundamentalData ticker={ticker} />
          </div>

          <div className='flex-1 min-h-0'>
            <Timeline ticker={ticker} exchange={exchange} />
          </div>
        </div>
      </div>

      <div className='shrink-0'>
        <TradingViewCopyright
          href={`https://www.tradingview.com/symbols/${ticker}/`}
          linkText={`${ticker} stock data`}
        />
      </div>
    </div>
  );
}

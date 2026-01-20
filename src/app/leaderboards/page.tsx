import { getTopMentionedTickers } from '@/actions/actions';
import SymbolInfo from '@/components/trading-view/symbol-info';
import SymbolOverview from '@/components/trading-view/symbol-overview';
import React from 'react';

const Leaderboards = async () => {
  const topMentionedTickers = await getTopMentionedTickers();

  console.log(topMentionedTickers);

  return (
    <div className='grow flex flex-row font-sans xl:px-10 px-0'>
      <div className='w-[40%]'></div>
      <div className='grow flex flex-col xl:max-w-[70%] max-w-[60%] min-w-[50%]'>
        <div>
          <SymbolInfo name='Google' ticker='googl' />
        </div>
        <div className='grow h-[80%]'>
          <SymbolOverview
            symbols={[
              { name: 'Apple', ticker: 'AAPL' },
              { name: 'Google', ticker: 'googl' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;

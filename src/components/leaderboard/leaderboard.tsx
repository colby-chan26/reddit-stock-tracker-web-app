'use client';

import { useState } from 'react';
import SymbolInfo from '@/components/trading-view/symbol-info';
import SymbolOverview from '@/components/trading-view/symbol-overview';
import type { LeaderboardStock } from '@/types';
import { Accordion } from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LeaderboardItem from './leaderboard-item';

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
              Based on my collected Reddit data, ranked by sum of all post
              upvotes mentioning the stock
            </CardDescription>
          </CardHeader>
          <CardContent className='min-h-0 overflow-y-auto'>
            <Accordion type='single' collapsible defaultValue='plans'>
              {stocks.map((stock, index) => (
                <LeaderboardItem
                  key={stock.ticker}
                  stock={stock}
                  index={index}
                  onSelect={setSelectedStock}
                />
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

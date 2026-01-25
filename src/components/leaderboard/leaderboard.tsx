'use client';

import { useState } from 'react';
import SymbolInfo from '@/components/trading-view/symbol-info';
import SymbolOverview from '@/components/trading-view/symbol-overview';
import type { LeaderboardStock } from '@/actions/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {
  stocks: LeaderboardStock[];
};

export default function Leaderboard({ stocks }: Props) {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);

  return (
    <div className='grow flex flex-row font-sans xl:px-10 px-0 gap-2 overflow-hidden'>
      <div className='w-[40%] h-full pb-5'>
        <Card className='w-full h-full'>
          <CardHeader>
            <CardTitle>Reddit Stock Leaderboard</CardTitle>
            <CardDescription>
              Based on my collected Reddit data, ranked by total post score
            </CardDescription>
          </CardHeader>
          <CardContent className='min-h-0 overflow-y-auto'>
            <Accordion type='single' collapsible defaultValue='plans'>
              {stocks.map((stock, index) => (
                <AccordionItem key={stock.name} value={stock.ticker}>
                  <AccordionTrigger onClick={() => setSelectedStock(stock)}>
                    <span className='flex items-center'>
                      <span className='bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2'>
                        {index + 1}
                      </span>
                      {stock.name}
                    </span>
                    <span className='text-muted-foreground text-sm ml-auto mr-2'>
                      {stock.score?.toLocaleString()}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {stock.summary}
                  </AccordionContent>
                </AccordionItem>
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

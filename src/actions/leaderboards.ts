'use server';

import prisma from '@/lib/prisma';
import yahooFinance from './yahoo-finance';
import { LeaderboardStock } from '@/types';
import { getWeeklyFilter, TimeFrame } from './utils';

export async function getTopMentionedTickers(timeFrame: TimeFrame): Promise<LeaderboardStock[]> {

  const whereClause = timeFrame === 'weekly' ? await getWeeklyFilter() : {}
  // pull reddit specific data
  const aggregations = await prisma.stocks.groupBy({
    by: ['ticker'],
    _sum: {
      score: true,
    },
    _min: {
      created_utc: true,
    },
    where: whereClause,
    orderBy: {
      _sum: {
        score: 'desc',
      },
    },
    take: 15,
  });

  // get general stock data for tickers
  const stockData: LeaderboardStock[] = [];
  for (const { ticker, _sum, _min } of aggregations) {
    if (!ticker) {
      continue;
    }
    const quote = await yahooFinance.quoteSummary(ticker, {
      modules: ['summaryProfile', 'price'],
    });

    const exchangeName = quote.price?.exchangeName;
    console.log(exchangeName);
    const exchangeDisplay = exchangeName?.includes('Nasdaq') 
      ? 'Nasdaq' 
      : exchangeName?.includes('NYSE') 
        ? 'NYSE'
        : exchangeName;

    stockData.push({
      score: _sum.score,
      earliest_post: _min.created_utc,
      exchange: exchangeDisplay,
      ticker,
      name: quote.price?.longName ?? quote.price?.shortName,
      city: quote.summaryProfile?.city,
      country: quote.summaryProfile?.country,
      industry: quote.summaryProfile?.industry,
      sector: quote.summaryProfile?.sector,
      website: quote.summaryProfile?.website,
      summary: quote.summaryProfile?.longBusinessSummary,
    });
  }

  return stockData;
}

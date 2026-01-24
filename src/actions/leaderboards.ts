import prisma from '@/lib/prisma';
import yahooFinance from './yahoo-finance';
import type { LeaderboardStock } from './types';

export async function getTopMentionedTickers(): Promise<LeaderboardStock[]> {
  // pull reddit specific data
  const aggregations = await prisma.stocks.groupBy({
    by: ['ticker'],
    _sum: {
      score: true,
    },
    _min: {
      created_utc: true,
    },
    orderBy: {
      _sum: {
        score: 'desc',
      },
    },
    take: 10,
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
    stockData.push({
      score: _sum.score,
      earliest_post: _min.created_utc,
      ticker,
      name: quote.price?.longName,
      country: quote.summaryProfile?.country,
      industry: quote.summaryProfile?.industry,
      sector: quote.summaryProfile?.sector,
      website: quote.summaryProfile?.website,
      summary: quote.summaryProfile?.longBusinessSummary,
    });
  }

  console.log(stockData);
  return stockData;
}

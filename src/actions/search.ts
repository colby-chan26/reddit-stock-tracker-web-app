'use server';

import yahooFinance from './yahoo-finance';

export async function tickerSearch(input: string) {
  const results = await yahooFinance.search(input, {
    quotesCount: 5,
    newsCount: 0,
    enableNavLinks: false,
  })
  return results;
}
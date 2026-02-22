'use server';

import { unstable_cache } from 'next/cache';
import { getTopMentionedTickers } from './leaderboards';
import { getTickerInstancesAll } from './data';
import { getSubreddits } from './subreddit';
import { tickerSearch as searchTickers } from './search';

export const getTopMentionedTickersAllCached = unstable_cache(
  getTopMentionedTickers,
  ['leaderboards'],
  { revalidate: 172800 },
);

export const getTickerInstancesAllCached = unstable_cache(
  getTickerInstancesAll,
  ['tickerInstancesAll'],
  { revalidate: 172800 },
);

export const getSubredditsCached = unstable_cache(
  getSubreddits,
  ['subreddits'],
  { revalidate: 1209600 },
);

export async function tickerSearch(input: string) {
  return searchTickers(input);
}

'use server';

import { unstable_cache } from 'next/cache';
import { getTopMentionedTickers } from './leaderboards';
import {
  getTickerInstancesAll,
  sanitizeTickerQuery,
  FilterTickerParams,
  SortTickerParams,
} from './data';
import { getSubreddits } from './subreddit';

export const getTopMentionedTickersAllCached = unstable_cache(
  getTopMentionedTickers,
  ['leaderboards'],
  { revalidate: 172800 },
);

const getTickerInstancesAllCachedUnsafe = unstable_cache(
  getTickerInstancesAll,
  ['tickerInstancesAll'],
  { revalidate: 172800 },
);

// Sanitize before hitting the cache so arbitrary client args can't create cache entries
export async function getTickerInstancesAllCached(
  page: number,
  sortBy?: SortTickerParams,
  filterBy?: FilterTickerParams,
) {
  return getTickerInstancesAllCachedUnsafe(
    ...sanitizeTickerQuery(page, sortBy, filterBy),
  );
}

export const getSubredditsCached = unstable_cache(
  getSubreddits,
  ['subreddits'],
  { revalidate: 1209600 },
)

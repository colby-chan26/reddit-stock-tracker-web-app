'use server';

import { unstable_cache } from 'next/cache';
import { getTopMentionedTickers } from './leaderboards';

export const getTopMentionedTickersAllTimeCached = unstable_cache(
  getTopMentionedTickers,
  ['leaderboards'],
  { revalidate: 86400 },
);


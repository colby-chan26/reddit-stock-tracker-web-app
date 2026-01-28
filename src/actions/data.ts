'use server';

import { TickerInstance } from '@/types';
import prisma from '@/lib/prisma';

const ENTRIES_PER_PAGE = 50;

export async function getTickerInstancesAll(page: number): Promise<TickerInstance[]> {
  const instances = await prisma.stocks.findMany({
    skip: page * ENTRIES_PER_PAGE,
    take: ENTRIES_PER_PAGE,
    orderBy: [
      {
        score: 'desc',
      }
    ]
  });

  return instances.map((instance) => ({
    postId: instance.post_id ?? '',
    submissionId: instance.submission_id ?? '',
    ticker: instance.ticker?.trim() ?? '',
    author: instance.author ?? '',
    subreddit: instance.subreddit ?? '',
    score: instance.score ?? 0,
    type: instance.type!,
    creationDate: instance.created_utc ?? new Date(),
  }));
}

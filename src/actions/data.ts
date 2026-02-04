'use server';

import { TickerInstance } from '@/types';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

const ENTRIES_PER_PAGE = 50;

export type SortTickerParams = Prisma.stocksOrderByWithRelationInput;
export type FilterTickerParams = Prisma.stocksWhereInput;

export async function getTickerInstancesAll(
  page: number,
  sortBy?: SortTickerParams,
  filterBy?: FilterTickerParams,
): Promise<TickerInstance[]> {
  const safePage = Math.max(1, page);
  const instances = await prisma.stocks.findMany({
    where: filterBy,
    orderBy: sortBy ?? { score: 'desc' },
    skip: (safePage - 1) * ENTRIES_PER_PAGE,
    take: ENTRIES_PER_PAGE,
  });

  return instances.map((instance) => ({
    post_id: instance.post_id ?? '',
    submission_id: instance.submission_id ?? '',
    ticker: instance.ticker?.trim() ?? '',
    author: instance.author ?? '',
    subreddit: instance.subreddit ?? '',
    score: instance.score ?? 0,
    type: instance.type!,
    created_utc: instance.created_utc ?? new Date(),
  }));
}

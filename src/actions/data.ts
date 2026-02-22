'use server';

import { TickerInstance } from '@/types';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { getWeeklyFilter, TimeFrame } from './utils';

const ENTRIES_PER_PAGE = 50;

export type SortTickerParams = Prisma.stocksOrderByWithRelationInput;
export type FilterTickerParams = Prisma.stocksWhereInput;

export type QueryReturn = {
  data: TickerInstance[];
  count: number;
};

export async function getTickerInstancesAll(
  timeFrame: TimeFrame,
  page: number,
  sortBy?: SortTickerParams,
  filterBy?: FilterTickerParams,
): Promise<QueryReturn> {
  const safePage = Math.max(0, page);

  const whereClause: Prisma.stocksWhereInput = {
    ...filterBy,
    ...(timeFrame === 'weekly' ? await getWeeklyFilter() : {}),
  };

  const instances = await prisma.stocks.findMany({
    where: whereClause,
    orderBy: sortBy ?? { score: 'desc' },
    skip: safePage * ENTRIES_PER_PAGE,
    take: ENTRIES_PER_PAGE,
  });

  const count = await prisma.stocks.count({
    where: whereClause,
  });

  const data = instances.map((instance) => ({
    post_id: instance.post_id ?? '',
    submission_id: instance.submission_id ?? '',
    ticker: instance.ticker?.trim() ?? '',
    author: instance.author ?? '',
    subreddit: instance.subreddit ?? '',
    score: instance.score ?? 0,
    type: instance.type!,
    created_utc: instance.created_utc ?? new Date(),
  }));

  return {
    data,
    count,
  };
}

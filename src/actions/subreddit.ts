'use server';

import prisma from '@/lib/prisma';

export const getSubreddits = async (): Promise<string[]> => {
  const subreddits = await prisma.stocks.findMany({
    distinct: ['subreddit'],
    select: {
      subreddit: true,
    }
  })
  return subreddits.map(s => s.subreddit).filter((s) => s !== null);
}
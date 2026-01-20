'use server'

import prisma from "@/lib/prisma";

export async function getTopMentionedTickers() {
  const aggregations = await prisma.stocks.groupBy({
    by: ['ticker'],
    _sum: {
      score: true
    },
    _min: {
      created_utc: true
    },
    orderBy: {
      _sum: {
        score: 'desc'
      }
    },
    take: 10,
  });

  return aggregations;
}
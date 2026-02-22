import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export type TimeFrame = 'weekly' | 'all'

export const getWeeklyFilter = async (): Promise<Prisma.stocksWhereInput> => {
  const latestEntry = await prisma.stocks.findFirst({
    orderBy: { created_utc: 'desc' },
    select: { created_utc: true },
  });

  if (!latestEntry?.created_utc) return {};

  return {
    created_utc: {
      gte: new Date(
        latestEntry.created_utc.getTime() - 7 * 24 * 60 * 60 * 1000,
      ),
    },
  };
};

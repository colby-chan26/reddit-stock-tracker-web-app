import { stocks } from "./generated/prisma/client";

export type LeaderboardStock = {
  score: number | null;
  earliest_post: Date | null;
  ticker: string;
  name?: string | null;
  city?: string;
  country?: string;
  industry?: string;
  sector?: string;
  website?: string;
  summary?: string;
};

export type TickerInstance = Omit<stocks, 'id'>

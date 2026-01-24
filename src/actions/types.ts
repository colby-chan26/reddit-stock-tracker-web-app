export type LeaderboardStock = {
  score: number | null;
  earliest_post: Date | null;
  ticker: string;
  name?: string | null;
  country?: string;
  industry?: string;
  sector?: string;
  website?: string;
  summary?: string;
};

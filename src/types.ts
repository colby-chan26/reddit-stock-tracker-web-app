import { submission_type } from "./generated/prisma/enums";

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

export type TickerInstance = {
  postId: string;
  submissionId: string;
  ticker: string;
  author: string;
  subreddit: string;
  score: number;
  type: submission_type;
  creationDate: Date;
};

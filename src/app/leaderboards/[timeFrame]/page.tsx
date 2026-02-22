import { getTopMentionedTickersAllCached } from '@/actions/actions';
import Leaderboard from '@/components/leaderboard/leaderboard';
import React from 'react';

const LeaderboardsPage = async ({
  params
}: {
  params: Promise<{ timeFrame: 'all' | 'weekly' }>;
}) => {
  const timeFrame = (await params).timeFrame;
  const topMentionedTickers = await getTopMentionedTickersAllCached(timeFrame);

  return <Leaderboard stocks={topMentionedTickers} />;
};

export default LeaderboardsPage;

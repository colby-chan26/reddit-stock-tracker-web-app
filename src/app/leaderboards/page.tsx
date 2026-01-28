import { getTopMentionedTickersAllCached } from '@/actions/actions';
import Leaderboard from '@/components/leaderboard/leaderboard';
import React from 'react';

const LeaderboardsPage = async () => {
  const topMentionedTickers = await getTopMentionedTickersAllCached();

  return <Leaderboard stocks={topMentionedTickers} />;
};

export default LeaderboardsPage;

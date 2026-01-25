import { getTopMentionedTickersAllTimeCached } from '@/actions/actions';
import Leaderboard from '@/components/leaderboard/leaderboard';
import React from 'react';

const LeaderboardsPage = async () => {
  const topMentionedTickers = await getTopMentionedTickersAllTimeCached();

  console.log(topMentionedTickers);

  return <Leaderboard stocks={topMentionedTickers} />;
};

export default LeaderboardsPage;

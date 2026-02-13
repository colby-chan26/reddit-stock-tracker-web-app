import { DataTable } from '@/components/data-table/data-table';
import { getSubredditsCached } from '@/actions/actions';
import { getTickerInstancesAll } from '@/actions/data';

export default async function DemoPage({
  params,
}: {
  params: Promise<{ timeFrame: 'all' | 'weekly' }>;
}) {
  const subreddits = await getSubredditsCached();
  const timeFrame = (await params).timeFrame;

  const fetchData = getTickerInstancesAll.bind(null, timeFrame === 'weekly' ? 'weekly' : 'all');

  return <DataTable subreddits={subreddits} fetchData={fetchData} />;
}

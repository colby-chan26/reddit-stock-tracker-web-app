import { DataTable } from '@/components/data-table/data-table';
import { getSubredditsCached } from '@/actions/actions';

export default async function DemoPage({
  params,
}: {
  params: Promise<{ timeFrame: 'all' | 'weekly' }>;
}) {
  const subreddits = await getSubredditsCached();

  const timeFrame = (await params).timeFrame;

  return <DataTable subreddits={subreddits}/>;
}

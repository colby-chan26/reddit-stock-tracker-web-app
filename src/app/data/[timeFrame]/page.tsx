import { DataTable } from '@/components/data-table/data-table';

export default async function DemoPage({
  params,
}: {
  params: Promise<{ timeFrame: 'all' | 'weekly' }>;
}) {
  const timeFrame = (await params).timeFrame;

  return <DataTable />;
}

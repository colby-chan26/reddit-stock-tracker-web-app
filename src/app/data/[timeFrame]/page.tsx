import { getTickerInstancesAllCached } from "@/actions/actions";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";

export default async function DemoPage({ params }: { params: Promise<{ timeFrame: 'all' | 'weekly' }> }) {
  const timeFrame = (await params).timeFrame;

  const data = await getTickerInstancesAllCached(1);

  return (
    <div className="container mx-auto py-10 overflow-y-scroll">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
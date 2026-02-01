'use client';

import {
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { getTickerInstancesAllCached } from '@/actions/actions';
import { SortTickerParams } from '@/actions/data';
import { TickerInstance } from '@/types';
import { columns } from './columns';

export function DataTable() {
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TickerInstance[]>([]);

  console.log(sorting);

  useEffect(() => {
    (async () => {
      const sort = sorting.length ? sorting[0] : undefined;
      const sortTickerParams = sort
        ? ({ [sort.id]: sort.desc ? 'desc' : 'asc' } as SortTickerParams)
        : undefined;
      const responseData = await getTickerInstancesAllCached(
        page,
        sortTickerParams,
      );
      setData(responseData);
    })();
  }, [sorting, page]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    state: {
      sorting,
    },
  });

  return (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={`${header.id}-${sorting.map((s) => `${s.id}-${s.desc}`).join(',')}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

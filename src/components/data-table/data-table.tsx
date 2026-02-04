'use client';

import {
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
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
import { FilterTickerParams, SortTickerParams } from '@/actions/data';
import { TickerInstance } from '@/types';
import { columns, OPERATION_BY_COLUMN } from './columns';
import { SearchBar } from './search-bar';

const constructSortParams = (sortState: SortingState) => {
  const sort = sortState.length ? sortState[0] : undefined;
  return sort
    ? ({ [sort.id]: sort.desc ? 'desc' : 'asc' } as SortTickerParams)
    : undefined;
};

const constructfilterParams = (filterState: ColumnFiltersState): FilterTickerParams => {
  return filterState.reduce<Record<string, Record<string, unknown>>>(
    (filterParams, { id, value }) => {
      const operator =
        OPERATION_BY_COLUMN[id as keyof TickerInstance] ?? 'equals';
      filterParams[id] = { [operator]: value, mode: 'insensitive' };
      return filterParams;
    },
    {},
  );
};

export function DataTable() {
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TickerInstance[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    (async () => {
      const sortParams = constructSortParams(sorting);
      const filterParams = constructfilterParams(columnFilters);
      console.log(filterParams);
      const responseData = await getTickerInstancesAllCached(page, sortParams, filterParams);
      setData(responseData);
    })();
  }, [sorting, page, columnFilters]);

  const onSearch = (newFilterState: ColumnFiltersState) => {
    setColumnFilters(newFilterState);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className='flex flex-col grow overflow-hidden'>
      <SearchBar onSearch={onSearch} />
      <div className='grow overflow-x-hidden overflow-y-auto rounded-md border px-2 mb-3'>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

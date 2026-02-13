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
import {
  FilterTickerParams,
  QueryReturn,
  SortTickerParams,
} from '@/actions/data';
import { TickerInstance } from '@/types';
import { columns, OPERATION_BY_COLUMN } from './columns';
import { SearchBar } from '../leaderboard/search-bar';
import { stocksWhereInput } from '@/generated/prisma/models';
import { DataTablePagination } from './components/pagination';

const PAGE_SIZE = 50;

const constructSortParams = (sortState: SortingState) => {
  const sort = sortState.length ? sortState[0] : undefined;
  return sort
    ? ({ [sort.id]: sort.desc ? 'desc' : 'asc' } as SortTickerParams)
    : undefined;
};

const constructMultiFilter = (id: string, value: unknown[]) => {
  const useInsensitive = id !== 'type';
  return {
    OR: value.map((v) => {
      const operator =
        OPERATION_BY_COLUMN[id as keyof TickerInstance] ?? 'equals';
      return {
        [id]: {
          [operator]: v,
          mode: useInsensitive ? 'insensitive' : undefined,
        },
      };
    }),
  };
};

const constructfilterParams = (
  filterState: ColumnFiltersState,
): FilterTickerParams => {
  const filterParams: FilterTickerParams = {
    AND: [],
  };

  for (const { id, value } of filterState) {
    if (Array.isArray(value)) {
      const filterOR = constructMultiFilter(id, value);
      (filterParams.AND! as stocksWhereInput[]).push(filterOR);
    } else {
      const operator =
        OPERATION_BY_COLUMN[id as keyof TickerInstance] ?? 'equals';
      filterParams[id as keyof TickerInstance] = {
        [operator]: value,
        mode: 'insensitive',
      };
    }
  }

  return filterParams;
};

interface DataTableProps {
  subreddits: string[];
  fetchData: (
    page: number,
    sortBy?: SortTickerParams,
    filterBy?: FilterTickerParams,
  ) => Promise<QueryReturn>;
}

export function DataTable({ subreddits, fetchData }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TickerInstance[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowCount, setRowCount] = useState<number>();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    (async () => {
      const sortParams = constructSortParams(sorting);
      const filterParams = constructfilterParams(columnFilters);
      const responseData = await fetchData(
        pagination.pageIndex,
        sortParams,
        filterParams,
      );
      setRowCount(responseData.count);
      setData(responseData.data);
    })();
  }, [sorting, columnFilters, pagination, fetchData]);

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
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    rowCount,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className='flex flex-col grow overflow-hidden'>
      <SearchBar onSearch={onSearch} subreddits={subreddits} />
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
      <div className='mb-3'>
        <DataTablePagination
          key={data.toString() + pagination.pageIndex}
          table={table}
        />
      </div>
    </div>
  );
}

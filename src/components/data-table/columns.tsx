'use client';

import { CellContext, ColumnDef } from '@tanstack/react-table';
import { submission_type } from '@/generated/prisma/enums';
import { ExternalLinkIcon } from 'lucide-react';
import { TickerInstance } from '@/types';
import { Button } from '../ui/button';
import { SortableColumnHeader } from './sortable-column-header';

export const SEARCHABLE_COLUMN_OPTIONS = [
  {
    label: 'Ticker',
    value: 'ticker',
  },
  {
    label: 'Author',
    value: 'author',
  },
];

export const OPERATION_BY_COLUMN: Partial<Record<keyof TickerInstance, string>> = {
  ticker: 'startsWith',
  author: 'startsWith',
  type: 'equals',
  subreddit: 'equals',
};

const toActionsCell = ({ row }: CellContext<TickerInstance, unknown>) => {
  const { type, post_id, submission_id, subreddit } = row.original;

  const isPost = type === submission_type.POST;
  const basePath = `https://www.reddit.com/r/${subreddit}/comments/${post_id}`;
  const link = isPost ? basePath : `${basePath}/comment/${submission_id}`;

  return (
    <a href={link} target='_blank'>
      <Button variant='ghost'>
        <ExternalLinkIcon />
      </Button>
    </a>
  );
};

export const columns: ColumnDef<TickerInstance>[] = [
  {
    accessorKey: 'ticker',
    header: ({ column }) => (
      <SortableColumnHeader column={column} title='Ticker' className='ml-2' />
    ),
  },
  {
    accessorKey: 'score',
    header: ({ column }) => (
      <SortableColumnHeader column={column} title='Score' />
    ),
  },
  {
    accessorKey: 'author',
    header: 'Author',
  },
  {
    accessorKey: 'type',
    header: 'Submission Type',
  },
  {
    id: 'created_utc',
    accessorFn: (rowData) =>
      rowData.created_utc ? new Date(rowData.created_utc).toLocaleString() : '',
    header: ({ column }) => (
      <SortableColumnHeader column={column} title='Date Created' />
    ),
  },
  {
    accessorKey: 'subreddit',
    header: 'Subreddit',
  },
  {
    id: 'actions',
    cell: toActionsCell,
  },
];

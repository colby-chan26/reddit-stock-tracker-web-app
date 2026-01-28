'use client';

import { CellContext, ColumnDef } from '@tanstack/react-table';
import { submission_type } from '@/generated/prisma/enums';
import { ExternalLinkIcon } from 'lucide-react';
import { TickerInstance } from '@/types';
import { Button } from '../ui/button';

const toActionsCell = ({ row }: CellContext<TickerInstance, unknown>) => {
  const { type, postId, submissionId, subreddit } = row.original;

  const isPost = type === submission_type.POST;
  const basePath = `https://www.reddit.com/r/${subreddit}/comments/${postId}`;
  const link = isPost ? basePath : `${basePath}/comment/${submissionId}`;

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
    header: 'Ticker',
  },
  {
    accessorKey: 'score',
    header: 'Score',
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
    accessorFn: (rowData) => new Date(rowData.creationDate),
    header: 'Date Created',
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

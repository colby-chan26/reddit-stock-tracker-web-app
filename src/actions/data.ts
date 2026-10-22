import { TickerInstance } from '@/types';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { submission_type } from '@/generated/prisma/enums';

const ENTRIES_PER_PAGE = 50;
const MAX_PAGE = 10000;
const MAX_FILTER_LENGTH = 30;
const MAX_FILTER_GROUPS = 5;
const MAX_FILTER_GROUP_SIZE = 50;

export type SortTickerParams = Prisma.stocksOrderByWithRelationInput;
export type FilterTickerParams = Prisma.stocksWhereInput;

// Only these columns may be sorted/filtered on, with these operators.
// Server action arguments come from the client, so never pass them to Prisma as-is.
const SORTABLE_COLUMNS = [
  'ticker',
  'score',
  'author',
  'subreddit',
  'type',
  'created_utc',
] as const;
const STRING_FILTER_OPERATORS = {
  ticker: 'startsWith',
  author: 'startsWith',
  subreddit: 'equals',
} as const;
const SUBMISSION_TYPES = Object.values(submission_type) as string[];

const sanitizePage = (page: unknown): number =>
  typeof page === 'number' && Number.isInteger(page)
    ? Math.min(Math.max(1, page), MAX_PAGE)
    : 1;

const sanitizeSort = (sortBy: unknown): SortTickerParams | undefined => {
  if (!sortBy || typeof sortBy !== 'object') return undefined;
  for (const column of SORTABLE_COLUMNS) {
    const direction = (sortBy as Record<string, unknown>)[column];
    if (direction === 'asc' || direction === 'desc') {
      return { [column]: direction };
    }
  }
  return undefined;
};

const getFilterValue = (filter: unknown, operator: string): string | undefined => {
  if (!filter || typeof filter !== 'object') return undefined;
  const value = (filter as Record<string, unknown>)[operator];
  return typeof value === 'string' && value.length <= MAX_FILTER_LENGTH
    ? value
    : undefined;
};

// Rebuilds the allowed column conditions found directly on `raw`
const sanitizeConditions = (raw: Record<string, unknown>): FilterTickerParams => {
  const where: FilterTickerParams = {};

  for (const [column, operator] of Object.entries(STRING_FILTER_OPERATORS)) {
    const value = getFilterValue(raw[column], operator);
    if (value) {
      where[column as keyof typeof STRING_FILTER_OPERATORS] = {
        [operator]: value,
        mode: 'insensitive',
      };
    }
  }

  const type = getFilterValue(raw.type, 'equals');
  if (type && SUBMISSION_TYPES.includes(type)) {
    where.type = { equals: type as submission_type };
  }

  return where;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

// Accepts { ...conditions, AND: [{ OR: [conditions, ...] }, ...] } as built by the data table
const sanitizeFilter = (filterBy: unknown): FilterTickerParams | undefined => {
  if (!isObject(filterBy)) return undefined;
  const where = sanitizeConditions(filterBy);

  if (Array.isArray(filterBy.AND)) {
    const groups = filterBy.AND.slice(0, MAX_FILTER_GROUPS)
      .filter(isObject)
      .filter((group) => Array.isArray(group.OR))
      .map((group) =>
        (group.OR as unknown[])
          .slice(0, MAX_FILTER_GROUP_SIZE)
          .filter(isObject)
          .map(sanitizeConditions)
          .filter((condition) => Object.keys(condition).length),
      )
      .filter((conditions) => conditions.length)
      .map((conditions) => ({ OR: conditions }));

    if (groups.length) where.AND = groups;
  }

  return Object.keys(where).length ? where : undefined;
};

export function sanitizeTickerQuery(
  page: unknown,
  sortBy: unknown,
  filterBy: unknown,
): [number, SortTickerParams | undefined, FilterTickerParams | undefined] {
  return [sanitizePage(page), sanitizeSort(sortBy), sanitizeFilter(filterBy)];
}

export async function getTickerInstancesAll(
  page: number,
  sortBy?: SortTickerParams,
  filterBy?: FilterTickerParams,
): Promise<TickerInstance[]> {
  return [];
  const safePage = Math.max(1, page);
  const instances = await prisma.stocks.findMany({
    where: filterBy,
    orderBy: sortBy ?? { score: 'desc' },
    skip: (safePage - 1) * ENTRIES_PER_PAGE,
    take: ENTRIES_PER_PAGE,
  });

  return instances.map((instance) => ({
    post_id: instance.post_id ?? '',
    submission_id: instance.submission_id ?? '',
    ticker: instance.ticker?.trim() ?? '',
    author: instance.author ?? '',
    subreddit: instance.subreddit ?? '',
    score: instance.score ?? 0,
    type: instance.type!,
    created_utc: instance.created_utc ?? new Date(),
  }));
}

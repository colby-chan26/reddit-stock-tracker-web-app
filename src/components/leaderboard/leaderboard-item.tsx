import Link from 'next/link';
import { GlobeIcon, LinkIcon } from 'lucide-react';
import type { LeaderboardStock } from '@/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type Props = {
  stock: LeaderboardStock;
  index: number;
  onSelect: (stock: LeaderboardStock) => void;
};

export default function LeaderboardItem({ stock, index, onSelect }: Props) {
  const {
    name,
    ticker,
    score,
    exchange,
    industry,
    sector,
    city,
    country,
    website,
    summary,
    earliest_post,
  } = stock;

  const location = city && country ? `${city}, ${country}` : city || country;
  const tickerLink = `/ticker/${ticker.trim()}${exchange ? `?exchange=${exchange}` : ''}`;

  return (
    <AccordionItem key={name} value={ticker}>
      <AccordionTrigger onClick={() => onSelect(stock)}>
        <span className='flex items-center'>
          <span className='bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2'>
            {index + 1}
          </span>
          {name}
        </span>
        <span className='text-muted-foreground text-sm ml-auto mr-2'>
          {score?.toLocaleString()}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex w-full flex-wrap gap-2 pb-3'>
          {industry && <Badge>{industry}</Badge>}
          {sector && <Badge variant='secondary'>{sector}</Badge>}
        </div>
        <div className='grid grid-cols-[auto_1fr] gap-2 pb-3'>
          {location && (
            <>
              <GlobeIcon />
              <div>{location}</div>
            </>
          )}
          {website && (
            <>
              <LinkIcon />
              <a
                className='text-primary hover:underline'
                href={website}
                target='_blank'
              >
                {website}
              </a>
            </>
          )}
        </div>
        {summary}
        {earliest_post && (
          <div className='text-xs text-muted-foreground pt-3'>
            First Collected Post: {new Date(earliest_post).toLocaleDateString()}
          </div>
        )}
        <div className='pt-3'>
          <Button asChild size='sm'>
            <Link href={tickerLink}>View Details</Link>
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

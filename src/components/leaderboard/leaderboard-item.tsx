import { GlobeIcon, LinkIcon } from 'lucide-react';
import type { LeaderboardStock } from '@/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '../ui/badge';

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
    industry,
    sector,
    city,
    country,
    website,
    summary,
    earliest_post,
  } = stock;

  const location = city && country ? `${city}, ${country}` : city || country;
  // website comes from a third-party API, only allow http(s) links
  const safeWebsite =
    website && /^https?:\/\//i.test(website) ? website : undefined;

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
          {safeWebsite && (
            <>
              <LinkIcon />
              <a
                className='text-primary hover:underline'
                href={safeWebsite}
                target='_blank'
                rel='noopener noreferrer'
              >
                {safeWebsite}
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
      </AccordionContent>
    </AccordionItem>
  );
}

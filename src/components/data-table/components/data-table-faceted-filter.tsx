import * as React from 'react';
import { Check, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface DataTableFacetedFilterProps<T extends string = string> {
  selected: Partial<Record<T, boolean>>;
  onSelectedChange?: (selected: Partial<Record<T, boolean>>) => void;
  title?: string;
  options: {
    label: string;
    value: T;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableFacetedFilter<T extends string = string>({
  selected,
  onSelectedChange,
  title,
  options,
}: DataTableFacetedFilterProps<T>) {
  const handleSelect = (value: T) => {
    onSelectedChange?.({
      ...selected,
      [value]: !selected[value],
    });
  };

  const handleClear = () => {
    onSelectedChange?.({});
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='[--radius:1rem] h-full border-dashed'>
          <PlusCircle />
          {title}
          {selectedCount > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <div className='hidden gap-1 lg:flex'>
                {selectedCount > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedCount} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selected[option.value])
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-50 p-0' align='start'>
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = !!selected[option.value];
                return (
                  <CommandItem
                    key={option.value + option.label + 'option'}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-lg border',
                        isSelected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-input [&_svg]:invisible',
                      )}
                    >
                      <Check className='text-primary-foreground size-3.5' />
                    </div>
                    {option.icon && (
                      <option.icon className='text-muted-foreground size-4' />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={handleClear}
                className='justify-center text-center'
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

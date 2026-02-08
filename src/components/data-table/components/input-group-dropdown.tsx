'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ChevronDownIcon } from 'lucide-react';
import { ChangeEventHandler } from 'react';

interface InputGroupDropdownProps {
  onFilterChange?: (filter: { key: string; value: string }) => void;
  title?: string;
  filter: { key: string; value: string };
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function InputGroupDropdown({
  onFilterChange,
  options,
  filter,
}: InputGroupDropdownProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const text = event.target.value;
    onFilterChange?.({ key: filter.key, value: text });
  };

  const onSelectMenuItem = (value: string) => {
    onFilterChange?.({ key: value, value: '' });
  };

  return (
    <div className='w-full max-w-sm gap-4'>
      <InputGroup className='[--radius:1rem]'>
        <InputGroupInput
          value={filter.value}
          onChange={handleChange}
          placeholder={`Search by ${filter.key}`}
        />
        <InputGroupAddon align='inline-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant='ghost' className='pr-1.5! text-xs'>
                Search In... <ChevronDownIcon className='size-3' />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='[--radius:0.95rem]'>
              <DropdownMenuGroup>
                {options.map((option) => (
                  <DropdownMenuItem
                    onClick={() => onSelectMenuItem(option.value)}
                    key={option.label + option.value}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

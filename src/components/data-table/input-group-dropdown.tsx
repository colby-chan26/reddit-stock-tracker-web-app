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
import { ChangeEventHandler, useState } from 'react';

interface InputGroupDropdownProps {
  onChange?: (id: string, value: string | undefined) => void;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function InputGroupDropdown({
  onChange,
  options,
}: InputGroupDropdownProps) {
  const [selectedColumnKey, setSelectedColumnKey] = useState<string>(
    options[0].value,
  );
  const [inputValue, setInputValue] = useState('');

  const handleChange: ChangeEventHandler<HTMLInputElement>  = (event) => {
    const text = event.target.value;
    setInputValue(text);
    onChange?.(selectedColumnKey, text)
  }

  const onSelectMenuItem = (value: string) => {
    setInputValue('');
    onChange?.(selectedColumnKey, undefined);
    setSelectedColumnKey(value);
  }

  return (
    <div className='w-full max-w-sm gap-4'>
      <InputGroup className='[--radius:1rem]'>
        <InputGroupInput value={inputValue} onChange={handleChange} placeholder={`Search by ${selectedColumnKey}`} />
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

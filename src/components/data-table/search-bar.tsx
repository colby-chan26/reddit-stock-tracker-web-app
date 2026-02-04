'use client';

import { useState } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { InputGroupDropdown } from './input-group-dropdown';
import { SEARCHABLE_COLUMN_OPTIONS } from './columns';
import { Button } from '../ui/button';

interface SearchBarProps {
  onSearch: (newFilterState: ColumnFiltersState) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [pendingFilters, setPendingFilter] = useState<ColumnFiltersState>([]);

  const onChange = (id: string, value: string | undefined) => {
    setPendingFilter((prev) => {
      if (!value) {
        return prev.filter((filter) => filter.id !== id);
      }

      const existingIndex = prev.findIndex((filter) => filter.id === id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { id, value };
        return updated;
      }
      return [...prev, { id, value }];
    });
  };

  const handleSearch = () => {
    onSearch(pendingFilters);
  };

  return (
    <div className='flex flex-row items-center px-1 py-3'>
      <InputGroupDropdown
        onChange={onChange}
        options={SEARCHABLE_COLUMN_OPTIONS}
      />
      <Button onClick={() => handleSearch()}>Search</Button>
    </div>
  );
};

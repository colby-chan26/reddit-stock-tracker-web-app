'use client';

import { useState } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { InputGroupDropdown } from './input-group-dropdown';
import { SEARCHABLE_COLUMN_OPTIONS, SUBMISSION_TYPE_OPTIONS } from './columns';
import { Button } from '../ui/button';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { submission_type } from '@/generated/prisma/enums';

interface SearchBarProps {
  onSearch: (newFilterState: ColumnFiltersState) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [submissionTypes, setSubmissionTypes] = useState<
    Partial<Record<submission_type, boolean>>
  >({});
  const [searchFilter, setSearchFilter] = useState({
    key: SEARCHABLE_COLUMN_OPTIONS[0].value,
    value: '',
  });

  const handleSearch = () => {
    const filtersArray: ColumnFiltersState = searchFilter.value
      ? [{ id: searchFilter.key, value: searchFilter.value }]
      : [];
    onSearch(filtersArray);
  };

  const handleReset = () => {
    setSearchFilter({ key: SEARCHABLE_COLUMN_OPTIONS[0].value, value: '' });
    setSubmissionTypes({})
    onSearch([]);
  };

  return (
    <div className='flex flex-row items-center px-1 py-3'>
      <InputGroupDropdown
        onFilterChange={setSearchFilter}
        options={SEARCHABLE_COLUMN_OPTIONS}
        filter={searchFilter}
      />
      <DataTableFacetedFilter
        selected={submissionTypes}
        onSelectedChange={setSubmissionTypes}
        options={SUBMISSION_TYPE_OPTIONS}
        title='Submission'
      />
      <Button onClick={handleSearch}>Search</Button>
      <Button variant='outline' onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
};

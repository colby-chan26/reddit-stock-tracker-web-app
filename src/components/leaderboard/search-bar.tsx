'use client';

import { useState } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { InputGroupDropdown } from '../data-table/components/input-group-dropdown';
import {
  SEARCHABLE_COLUMN_OPTIONS,
  SUBMISSION_TYPE_OPTIONS,
} from '../data-table/columns';
import { Button } from '../ui/button';
import { DataTableFacetedFilter } from '../data-table/components/data-table-faceted-filter';

interface SearchBarProps {
  onSearch: (newFilterState: ColumnFiltersState) => void;
  subreddits: string[];
}

export const SearchBar = ({ onSearch, subreddits }: SearchBarProps) => {
  const [submissionTypes, setSubmissionTypes] = useState<
    Partial<Record<string, boolean>>
  >({});
  const [searchFilter, setSearchFilter] = useState({
    key: SEARCHABLE_COLUMN_OPTIONS[0].value,
    value: '',
  });
  const [selectedSubreddits, setSelectedSubreddits] = useState<
    Partial<Record<string, boolean>>
  >({});

  const subredditOptions = subreddits.map((subreddit) => ({
    label: subreddit,
    value: subreddit,
  }));

  const handleSearch = () => {
    const filtersArray: ColumnFiltersState = [];
    if (searchFilter.value) {
      filtersArray.push({ id: searchFilter.key, value: searchFilter.value });
    }

    const searchSubmissionTypesBy = [];
    for (const [type, value] of Object.entries(submissionTypes)) {
      if (value) {
        searchSubmissionTypesBy.push(type);
      }
    }
    filtersArray.push({ id: 'type', value: searchSubmissionTypesBy });

    const searchSubredditsBy = [];
    for (const [subreddit, value] of Object.entries(selectedSubreddits)) {
      if (value) {
        searchSubredditsBy.push(subreddit);
      }
    }
    filtersArray.push({ id: 'subreddit', value: searchSubredditsBy });

    onSearch(filtersArray);
  };

  const handleReset = () => {
    setSearchFilter({ key: SEARCHABLE_COLUMN_OPTIONS[0].value, value: '' });
    setSubmissionTypes({});
    setSelectedSubreddits({});
    onSearch([]);
  };

  return (
    <div className='flex flex-row items-center gap-1 px-1 py-3'>
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
      <DataTableFacetedFilter
        selected={selectedSubreddits}
        onSelectedChange={setSelectedSubreddits}
        options={subredditOptions}
        title='Subreddit'
      />
      <Button onClick={handleSearch}>Search</Button>
      <Button variant='outline' onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
};

import { useCallback, useEffect, useMemo, useState } from 'react'

import Placeholder from '../../components/Placeholder'
import Table from '../../components/Table'
import { TableSorting } from '../../components/Table/types'
import {
  FILTER_DEBOUNCE_MS,
  IApplicationsFiltersState,
  initialApplicationsFiltersState,
  useApplications,
  useApplicationsTableColumns,
} from './hooks'

// -------------------------------------------------------------------------- //
//
// Exercise 2's frontend - given, do not change it. The table talks to
// `GET /api/applications/` through the hooks in `hooks.ts`; implement the
// endpoint and this page works.
//
// -------------------------------------------------------------------------- //

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 25

export const EMPTY_STATE_TITLE = 'No applications found'
export const ERROR_STATE_TITLE = 'Something went wrong'

/** Column key -> API ordering field. */
const ORDERING_FIELD_BY_COLUMN: Record<string, string> = {
  name: 'name',
  hostname: 'hostname',
  status: 'status',
  port: 'port',
  discovered: 'discovered_on',
}

/** Returns `value` only after it has stopped changing for `delay` ms. */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return debouncedValue
}

export function ApplicationsTable() {
  const [filters, setFilters] = useState(initialApplicationsFiltersState)
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<TableSorting>(undefined)
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const resetPage = useCallback(() => {
    setPagination((previous) => ({ ...previous, page: DEFAULT_PAGE }))
  }, [])

  const onFiltersChange = useCallback(
    (value: React.SetStateAction<IApplicationsFiltersState>) => {
      setFilters(value)
      resetPage()
    },
    [resetPage],
  )

  const onSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      resetPage()
    },
    [resetPage],
  )

  const onSortingChange = useCallback(
    (value: TableSorting) => {
      setSorting(value)
      resetPage()
    },
    [resetPage],
  )

  const columns = useApplicationsTableColumns(filters, onFiltersChange)

  const debouncedName = useDebouncedValue(
    filters.name.filterKeyword,
    FILTER_DEBOUNCE_MS,
  )
  const debouncedSearch = useDebouncedValue(search, FILTER_DEBOUNCE_MS)

  const orderingDirection = sorting?.isDesc ? '-' : ''
  const ordering = sorting
    ? `${orderingDirection}${ORDERING_FIELD_BY_COLUMN[sorting.id]}`
    : undefined

  const applications = useApplications({
    page: pagination.page + 1,
    size: pagination.pageSize,
    name: debouncedName,
    search: debouncedSearch,
    ordering,
  })

  const data = useMemo(
    () =>
      applications.items.map((item) => ({
        id: item.id,
        name: item.name,
        hostname: item.hostname,
        status: item.status,
        port: item.port,
        discovered: new Date(item.discovered_on).toLocaleDateString(),
      })),
    [applications.items],
  )

  const onClearAllFilters = () => {
    setFilters(initialApplicationsFiltersState)
    setSearch('')
    setSorting(undefined)
    resetPage()
  }

  // Read from the debounced values, since those are the ones the current
  // result set was fetched with - the live ones would flip this flag 300ms
  // early and flash the wrong empty state. Sorting is not a filter: it never
  // changes how many rows come back.
  const hasActiveFilters =
    debouncedName.trim() !== '' || debouncedSearch.trim() !== ''

  if (applications.isError) {
    return (
      <Placeholder
        type='error'
        title={ERROR_STATE_TITLE}
        text={applications.error?.message}
      />
    )
  }

  // With filters applied the table stays mounted: the user keeps the filter
  // inputs they typed into, plus a one-click way out of a dead end.
  if (
    !applications.isLoading &&
    applications.items.length === 0 &&
    !hasActiveFilters
  ) {
    return (
      <Placeholder
        type='nodata'
        title={EMPTY_STATE_TITLE}
        text='Try seeding the database.'
      />
    )
  }

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={applications.isLoading}
      sorting={sorting}
      onSorting={onSortingChange}
      globalSearch={{ value: search, onChange: onSearchChange }}
      onClearAllFilters={onClearAllFilters}
      emptyMessage={
        hasActiveFilters
          ? 'No applications match the current filters.'
          : EMPTY_STATE_TITLE
      }
      emptyAction={
        hasActiveFilters
          ? { label: 'Reset filters', onClick: onClearAllFilters }
          : undefined
      }
      pagination={{
        page: pagination.page,
        size: pagination.pageSize,
        totalCount: applications.totalCount,
        setPage: (page) => setPagination((previous) => ({ ...previous, page })),
        setSize: (pageSize) => {
          setPagination({ page: DEFAULT_PAGE, pageSize })
        },
      }}
    />
  )
}

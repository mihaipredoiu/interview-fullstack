import { ReactNode } from 'react'

// -------------------------------------------------------------------------- //

export type TableTextFilter = {
  type: 'textFilter'
  value: string
  onChange: (value: string) => void
}

export type TableColumn = {
  headerTitle: string
  isSortable?: boolean
  size?: number
  filter?: TableTextFilter
}

/** `undefined` means "no explicit sort - use the API default". */
export type TableSorting = { id: string; isDesc: boolean } | undefined

export type TablePagination = {
  /** Zero-based page index. */
  page: number
  size: number
  totalCount: number
  setPage: (page: number) => void
  setSize: (size: number) => void
}

/** Call to action rendered under the empty message, e.g. "Clear all filters". */
export type TableEmptyAction = { label: string; onClick: () => void }

/** Every row needs a stable id - never index rows by their array position. */
export type TableRow = { id: string | number } & Record<string, ReactNode>

export interface ITableProps<TableData extends TableRow> {
  /** Keys must match the keys of the row objects in `data`. */
  columns: Record<string, TableColumn>
  data: TableData[]
  isLoading?: boolean
  sorting?: TableSorting
  onSorting?: (sorting: TableSorting) => void
  globalSearch?: { value: string; onChange: (value: string) => void }
  /** Omit to render every row with no pagination controls. */
  pagination?: TablePagination
  onClearAllFilters?: () => void
  emptyMessage?: string
  /** Rendered inside the empty state - use it to offer a way out of a filter. */
  emptyAction?: TableEmptyAction
}

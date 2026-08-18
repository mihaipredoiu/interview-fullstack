import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import Dropdown from '../Dropdown'
import TextInput from '../TextInput'
import { ITableProps, TablePagination, TableRow, TableSorting } from './types'

import styles from './index.module.scss'

// -------------------------------------------------------------------------- //

const PAGE_SIZE_OPTIONS = [25, 50, 100].map((size) => ({
  label: `${size} / page`,
  value: size,
}))
const SKELETON_ROWS_COUNT = 5

/**
 * Table
 *
 * Presentational only: sorting, filtering and pagination are all controlled by
 * the parent, which is expected to translate them into API query params.
 */
export function Table<TableData extends TableRow>(
  props: Readonly<ITableProps<TableData>>,
) {
  const columnKeys = Object.keys(props.columns)

  const onHeaderClick = (columnKey: string) => {
    if (!props.onSorting) {
      return
    }

    const next = getNextSorting(props.sorting, columnKey)
    props.onSorting(next)
  }

  return (
    <div className={styles.Table}>
      <div className={styles.toolbar}>
        {props.globalSearch ? (
          <TextInput
            label='Search'
            placeholder='Search...'
            value={props.globalSearch.value}
            onChange={props.globalSearch.onChange}
          />
        ) : null}
        {props.onClearAllFilters ? (
          <button
            type='button'
            className={styles.clear}
            onClick={props.onClearAllFilters}
          >
            Clear all filters
          </button>
        ) : null}
      </div>

      <table>
        <thead>
          <tr>
            {columnKeys.map((columnKey) => {
              const column = props.columns[columnKey]
              const isSorted = props.sorting?.id === columnKey

              return (
                <th key={columnKey} style={{ width: column.size }}>
                  <div className={styles.headerCell}>
                    {column.isSortable ? (
                      <button
                        type='button'
                        className={styles.sort}
                        aria-label={`Sort by ${column.headerTitle}`}
                        onClick={() => onHeaderClick(columnKey)}
                      >
                        {column.headerTitle}
                        {!isSorted ? <ArrowUpDown /> : null}
                        {isSorted && !props.sorting?.isDesc ? <ArrowUp /> : null}
                        {isSorted && props.sorting?.isDesc ? <ArrowDown /> : null}
                      </button>
                    ) : (
                      <span>{column.headerTitle}</span>
                    )}
                    {column.filter ? (
                      <TextInput
                        label={`Filter by ${column.headerTitle}`}
                        placeholder='Filter...'
                        value={column.filter.value}
                        onChange={column.filter.onChange}
                      />
                    ) : null}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <TableBody {...props} columnKeys={columnKeys} />
      </table>

      {props.pagination ? <Pagination {...props.pagination} /> : null}
    </div>
  )
}

function TableBody<TableData extends TableRow>(
  props: Readonly<ITableProps<TableData> & { columnKeys: string[] }>,
) {
  if (props.isLoading) {
    return (
      <tbody>
        {Array.from({ length: SKELETON_ROWS_COUNT }, (_, index) => (
          <tr key={index} aria-hidden='true'>
            {props.columnKeys.map((columnKey) => (
              <td key={columnKey}>
                <span className={styles.skeleton} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

  if (props.data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={props.columnKeys.length} className={styles.empty}>
            <div className={styles.emptyContent}>
              <span>{props.emptyMessage ?? 'No results found'}</span>
              {props.emptyAction ? (
                <button
                  type='button'
                  className={styles.clear}
                  onClick={props.emptyAction.onClick}
                >
                  {props.emptyAction.label}
                </button>
              ) : null}
            </div>
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody>
      {props.data.map((row) => (
        <tr key={row.id}>
          {props.columnKeys.map((columnKey) => (
            <td key={columnKey}>{row[columnKey]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

function Pagination(props: Readonly<TablePagination>) {
  const totalPages = Math.max(Math.ceil(props.totalCount / props.size), 1)
  const isFirstPage = props.page <= 0
  const isLastPage = props.page >= totalPages - 1

  if (props.totalCount === 0) {
    return null
  }

  return (
    <div className={styles.pagination}>
      <span>
        Page {props.page + 1} of {totalPages} ({props.totalCount} total)
      </span>
      <div className={styles.controls}>
        <button
          type='button'
          aria-label='First page'
          disabled={isFirstPage}
          onClick={() => props.setPage(0)}
        >
          <ChevronsLeft />
        </button>
        <button
          type='button'
          aria-label='Previous page'
          disabled={isFirstPage}
          onClick={() => props.setPage(props.page - 1)}
        >
          <ChevronLeft />
        </button>
        <button
          type='button'
          aria-label='Next page'
          disabled={isLastPage}
          onClick={() => props.setPage(props.page + 1)}
        >
          <ChevronRight />
        </button>
        <button
          type='button'
          aria-label='Last page'
          disabled={isLastPage}
          onClick={() => props.setPage(totalPages - 1)}
        >
          <ChevronsRight />
        </button>
        <Dropdown
          label='Rows per page'
          options={PAGE_SIZE_OPTIONS}
          selected={props.size}
          onChange={props.setSize}
        />
      </div>
    </div>
  )
}

/** Cycles a column through ascending -> descending -> unsorted. */
function getNextSorting(
  current: TableSorting,
  columnKey: string,
): TableSorting {
  if (current?.id !== columnKey) {
    return { id: columnKey, isDesc: false }
  }
  if (!current.isDesc) {
    return { id: columnKey, isDesc: true }
  }

  return undefined
}

export default Table

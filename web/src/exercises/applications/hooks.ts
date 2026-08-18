import { useMemo } from 'react'

import { apiClient } from '../../api/client'
import { useFetch } from '../../api/useFetch'
import { TableColumn } from '../../components/Table/types'

// -------------------------------------------------------------------------- //
//
// Exercise 2's frontend - given, do not change it. It defines the contract
// your endpoint in `api/inventory/applications_view.py` must honour:
//
//   GET /api/applications/?page=1&size=25&name=&search=&ordering=-discovered_on
//   { items: [...], page, total_pages, total_count }
//
// Once the API respects that contract, the page just works.
//
// -------------------------------------------------------------------------- //

export const APPLICATIONS_URL = '/applications/'

/** The debounce applied to the free-text filters, in milliseconds. */
export const FILTER_DEBOUNCE_MS = 300

export type IApplicationStatus =
  | 'Online'
  | 'Offline'
  | 'Not Seen on Last Scan'
  | 'Decommissioned'

export interface IApplicationListItem {
  id: number
  name: string
  type: string
  hostname: string
  device_id: number
  status: IApplicationStatus
  risk_level: string
  port: number | string
  protocol: string
  transport_protocol: string
  discovered_on: string
  last_seen: string
  last_scanned: string | null
  scan_type: 'Scanned' | 'Discovered'
  scan_source: string
}

/** Normalized response consumed by the table. */
export interface IApplicationListResponse {
  items: IApplicationListItem[]
  page: number
  totalPages: number
  totalCount: number
}

/** Params consumed by the applications endpoint. */
export type IApplicationsParams = {
  /** 1-based, as the API expects it. */
  page?: number
  size?: number
  name?: string
  search?: string
  /** e.g. `name` or `-discovered_on`. */
  ordering?: string
}

type IApplicationListRawResponse = {
  items?: IApplicationListItem[]
  page?: number
  total_pages?: number
  total_count?: number
}

export async function fetchApplications(
  params: IApplicationsParams,
): Promise<IApplicationListResponse> {
  const response = await apiClient.get<IApplicationListRawResponse>(
    APPLICATIONS_URL,
    {
      params: {
        page: params.page,
        size: params.size,
        // Never send empty strings - they would filter on ''.
        name: params.name || undefined,
        search: params.search || undefined,
        ordering: params.ordering || undefined,
      },
    },
  )

  const raw = response.data

  return {
    items: raw.items ?? [],
    page: raw.page ?? 1,
    totalPages: raw.total_pages ?? 0,
    totalCount: raw.total_count ?? 0,
  }
}

export function useApplications(params: IApplicationsParams) {
  const query = useFetch(fetchApplications, params)

  return {
    items: query.data?.items ?? [],
    page: query.data?.page ?? 1,
    totalPages: query.data?.totalPages ?? 0,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export const initialApplicationsFiltersState = {
  name: { filterKeyword: '' },
}
export type IApplicationsFiltersState = typeof initialApplicationsFiltersState

/** Column definitions for the applications table. */
export function useApplicationsTableColumns(
  filters: IApplicationsFiltersState,
  setFilters: React.Dispatch<React.SetStateAction<IApplicationsFiltersState>>,
): Record<string, TableColumn> {
  return useMemo(
    () => ({
      name: {
        headerTitle: 'Name',
        isSortable: true,
        size: 250,
        filter: {
          type: 'textFilter' as const,
          value: filters.name.filterKeyword,
          onChange: (value: string) =>
            setFilters((previous) => ({
              ...previous,
              name: { filterKeyword: value },
            })),
        },
      },
      hostname: {
        headerTitle: 'Device Hostname',
        isSortable: true,
      },
      status: {
        headerTitle: 'Status',
        isSortable: false,
      },
      port: {
        headerTitle: 'Port',
        isSortable: true,
      },
      discovered: {
        headerTitle: 'Discovered On',
        isSortable: true,
      },
    }),
    [filters, setFilters],
  )
}

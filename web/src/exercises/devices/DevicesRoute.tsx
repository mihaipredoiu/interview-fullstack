import { useState } from 'react'

import { apiClient } from '../../api/client'
import { useFetch } from '../../api/useFetch'
import PageHeader from '../../components/PageHeader'
import Placeholder from '../../components/Placeholder'

import styles from './DevicesRoute.module.scss'

interface IDeviceListItem {
  id: number
  hostname: string
  ip_address: string
  tenant_name: string
  application_count: number
  online_count: number
  application_names: string[]
}

interface IDeviceListResponse {
  items: IDeviceListItem[]
  total_count: number
  /** Time the API spent building the response, measured server-side. */
  elapsed_ms: number
}

interface IDevicesResult {
  response: IDeviceListResponse
  /** The full round trip, as the browser saw it. */
  roundTripMs: number
}

const MAX_NAMES_SHOWN = 4

async function fetchDevices(): Promise<IDevicesResult> {
  const startedAt = performance.now()
  const { data } = await apiClient.get<IDeviceListResponse>('/devices/')
  return {
    response: data,
    roundTripMs: Math.round(performance.now() - startedAt),
  }
}

function timingClass(ms: number): string {
  if (ms >= 300) return styles.slow
  if (ms >= 100) return styles.ok
  return styles.fast
}

function formatNames(names: string[]): string {
  const shown = names.slice(0, MAX_NAMES_SHOWN).join(', ')
  const hidden = names.length - MAX_NAMES_SHOWN
  return hidden > 0 ? `${shown} +${hidden} more` : shown
}

export function DevicesRoute() {
  const [attempt, setAttempt] = useState(1)
  const { data, error, isLoading, isError } = useFetch(fetchDevices, {
    attempt,
  })

  return (
    <>
      <PageHeader
        title='Devices'
        description='Exercise 4: this page is correct but slow. Make the API fast without changing its response.'
      />
      <div className={styles.content}>
        {data ? (
          <div className={styles.timing}>
            <span
              className={`${styles.badge} ${timingClass(data.response.elapsed_ms)}`}
            >
              API {data.response.elapsed_ms.toLocaleString()} ms
            </span>
            <span
              className={`${styles.badge} ${timingClass(data.roundTripMs)}`}
            >
              round trip {data.roundTripMs.toLocaleString()} ms
            </span>
            <span className={styles.count}>
              {data.response.total_count.toLocaleString()} devices
            </span>
            <button
              type='button'
              className={styles.reload}
              onClick={() => setAttempt((current) => current + 1)}
              disabled={isLoading}
            >
              {isLoading ? 'Measuring…' : 'Measure again'}
            </button>
          </div>
        ) : null}

        {isError ? (
          <Placeholder
            type='error'
            title='The devices request failed'
            text={error?.message}
          />
        ) : null}
        {isLoading && !data ? (
          <p className={styles.loading}>Loading devices…</p>
        ) : null}

        {data ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hostname</th>
                <th>IP Address</th>
                <th>Tenant</th>
                <th>Apps</th>
                <th>Online</th>
                <th>Applications</th>
              </tr>
            </thead>
            <tbody>
              {data.response.items.map((device) => (
                <tr key={device.id}>
                  <td>{device.hostname}</td>
                  <td>{device.ip_address}</td>
                  <td>{device.tenant_name}</td>
                  <td>{device.application_count}</td>
                  <td>{device.online_count}</td>
                  <td className={styles.apps}>
                    {formatNames(device.application_names)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </>
  )
}

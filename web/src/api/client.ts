import axios from 'axios'

/**
 * The real product resolves the tenant from the logged-in user. Here it is a
 * header so there is no auth to set up - change it to see another tenant's data.
 */
export const TENANT_ID = 1

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'X-Tenant-Id': String(TENANT_ID) },
})

import { useEffect, useRef, useState } from 'react'

// -------------------------------------------------------------------------- //

type FetchState<TData> = {
  data: TData | undefined
  error: Error | null
  isLoading: boolean
  isError: boolean
}

/**
 * Minimal stand-in for React Query's `useQuery`.
 *
 * Refetches whenever `params` changes by value (not by identity) and drops the
 * result of a request that was superseded while in flight.
 */
export function useFetch<TParams, TData>(
  callback: (params: TParams) => Promise<TData>,
  params: TParams,
): FetchState<TData> {
  const [state, setState] = useState<FetchState<TData>>({
    data: undefined,
    error: null,
    isLoading: true,
    isError: false,
  })

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const serializedParams = JSON.stringify(params)

  useEffect(() => {
    let isCurrent = true
    setState((previous) => ({ ...previous, isLoading: true }))

    callbackRef
      .current(JSON.parse(serializedParams) as TParams)
      .then((data) => {
        if (isCurrent) {
          setState({ data, error: null, isLoading: false, isError: false })
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setState({
            data: undefined,
            error: error instanceof Error ? error : new Error('Network error'),
            isLoading: false,
            isError: true,
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [serializedParams])

  return state
}

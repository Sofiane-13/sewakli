import { useState, useCallback } from 'react'

/**
 * Generic async operation state
 */
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Return type for useAsync hook
 */
export interface UseAsyncReturn<T, Args extends any[]> extends AsyncState<T> {
  execute: (...args: Args) => Promise<T>
  reset: () => void
}

/**
 * Generic hook for managing async operations with loading, error, and data states
 *
 * @template T - The type of data returned by the async operation
 * @template Args - The types of arguments passed to the async function
 *
 * @param asyncFunction - The async function to execute
 * @returns Object containing execute function, data, loading, error states, and reset function
 *
 * @example
 * ```tsx
 * const { execute, data, loading, error } = useAsync(
 *   async (id: string) => api.getUser(id)
 * )
 *
 * const handleClick = async () => {
 *   try {
 *     await execute('123')
 *   } catch (err) {
 *     // Error is already set in state
 *   }
 * }
 * ```
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const result = await asyncFunction(...args)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setState({ data: null, loading: false, error })
        throw error
      }
    },
    [asyncFunction],
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

/**
 * Hook variant that returns a boolean success/failure instead of throwing errors
 *
 * @example
 * ```tsx
 * const { execute, success, loading } = useAsyncSafe(
 *   async (email: string) => authService.sendCode(email)
 * )
 *
 * const handleSend = async () => {
 *   const success = await execute(email)
 *   if (success) {
 *     // Handle success
 *   }
 * }
 * ```
 */
export function useAsyncSafe<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
) {
  const { execute, ...state } = useAsync(asyncFunction)

  const executeSafe = useCallback(
    async (...args: Args): Promise<boolean> => {
      try {
        await execute(...args)
        return true
      } catch {
        return false
      }
    },
    [execute],
  )

  return {
    ...state,
    execute: executeSafe,
    success: state.data !== null && !state.error,
  }
}

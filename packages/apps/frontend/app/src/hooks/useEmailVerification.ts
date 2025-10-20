import { useCallback } from 'react'
import { useAuthService } from './useAuthService'
import { useAsyncSafe } from './useAsync'

/**
 * Hook for email verification flow (send code + verify code)
 * @returns Object with sendCode and verifyCode functions, plus loading states
 */
export function useEmailVerification() {
  const authService = useAuthService()

  // Create async handlers using the generic hook
  const sendCodeAsync = useCallback(
    (email: string) => authService.sendEmailCode(email),
    [authService],
  )

  const verifyCodeAsync = useCallback(
    (email: string, code: string) => authService.verifyEmailCode(email, code),
    [authService],
  )

  const {
    execute: sendCode,
    loading: sendingCode,
    error: sendError,
  } = useAsyncSafe(sendCodeAsync)

  const {
    execute: verifyCode,
    loading: verifyingCode,
    error: verifyError,
  } = useAsyncSafe(verifyCodeAsync)

  return {
    sendCode,
    verifyCode,
    sendingCode,
    verifyingCode,
    error: sendError || verifyError,
  }
}

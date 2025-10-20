import { useState } from 'react'
import { useAuthService } from './useAuthService'

export function useEmailVerification() {
  const authService = useAuthService()
  const [error, setError] = useState<Error | null>(null)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)

  const sendCode = async (email: string): Promise<boolean> => {
    setError(null)
    setSendingCode(true)
    try {
      const result = await authService.sendEmailCode(email)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error sending code')
      setError(error)
      console.error('Error sending code:', err)
      return false
    } finally {
      setSendingCode(false)
    }
  }

  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    setError(null)
    setVerifyingCode(true)
    try {
      const result = await authService.verifyEmailCode(email, code)
      return result
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Error verifying code')
      setError(error)
      console.error('Error verifying code:', err)
      return false
    } finally {
      setVerifyingCode(false)
    }
  }

  return {
    sendCode,
    verifyCode,
    sendingCode,
    verifyingCode,
    error,
  }
}

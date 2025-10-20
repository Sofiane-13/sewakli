import { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { Alert, AlertDescription } from './ui/Alert'
import { useEmailVerification } from '../hooks/useEmailVerification'
import { useTranslation } from '../hooks/useTranslation'

interface EmailVerificationProps {
  onVerified: (email: string) => void
  loading?: boolean
  initialEmail?: string
}

export default function EmailVerification({
  onVerified,
  loading = false,
  initialEmail = '',
}: EmailVerificationProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [codeSent, setCodeSent] = useState(false)

  const { sendCode, verifyCode, sendingCode, verifyingCode, error } =
    useEmailVerification()

  const handleSendCode = async () => {
    setErrorMessage(null)

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setErrorMessage(t('invalidEmail'))
      return
    }

    const success = await sendCode(email)
    if (success) {
      setCodeSent(true)
    } else {
      setErrorMessage(error?.message || t('errorCreatingRoute'))
    }
  }

  // Envoyer automatiquement le code si initialEmail est fourni
  useEffect(() => {
    if (initialEmail && !codeSent && !sendingCode) {
      handleSendCode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail])

  const handleVerifyCode = async () => {
    setErrorMessage(null)

    if (!code || code.length !== 6) {
      setErrorMessage(t('verificationCodePlaceholder'))
      return
    }

    const success = await verifyCode(email, code)
    if (success) {
      // Code vérifié avec succès
      onVerified(email)
    } else {
      setErrorMessage(error?.message || t('invalidEmail'))
    }
  }

  const handleChangeEmail = () => {
    setCodeSent(false)
    setCode('')
    setErrorMessage(null)
  }

  return (
    <Card variant="default">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2.5">
          <span className="material-symbols-outlined text-primary text-2xl">
            email
          </span>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {t('emailVerification')}
          </h3>
        </div>

        {errorMessage && (
          <Alert variant="error">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <CardContent>
          {!codeSent ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2"
                >
                  {t('email')}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="w-full h-12 pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={sendingCode}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t('emailVerificationInfo')}
                </p>
              </div>

              <Button
                onClick={handleSendCode}
                type="button"
                variant="primary"
                className="w-full"
                isLoading={sendingCode}
                disabled={sendingCode || !email}
              >
                {sendingCode ? t('publishing') : t('verifyButton')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="code"
                    className="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                  >
                    {t('enterVerificationCode')}
                  </label>
                  <button
                    onClick={handleChangeEmail}
                    className="text-xs text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    type="button"
                  >
                    {t('changeEmail')}
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    lock
                  </span>
                  <input
                    id="code"
                    type="text"
                    maxLength={6}
                    className="w-full h-12 pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-center text-lg font-semibold tracking-widest"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    disabled={verifyingCode}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t('verificationCodeSent')} {email}
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleVerifyCode}
                  type="button"
                  variant="primary"
                  className="w-full"
                  isLoading={verifyingCode}
                  disabled={verifyingCode || code.length !== 6}
                >
                  {verifyingCode ? t('verifying') : t('verifyButton')}
                </Button>

                <Button
                  onClick={handleSendCode}
                  type="button"
                  variant="ghost"
                  className="w-full"
                  disabled={sendingCode}
                >
                  {t('resendCode')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}

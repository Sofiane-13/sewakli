/**
 * Email Service Port (Interface)
 * Defines the contract for email operations
 * This interface belongs to the application layer
 * Infrastructure layer will implement this interface
 */
export interface IEmailService {
  /**
   * Send verification code to email
   */
  sendVerificationCode(email: string): Promise<void>

  /**
   * Verify email with code
   */
  verifyCode(email: string, code: string): Promise<boolean>
}

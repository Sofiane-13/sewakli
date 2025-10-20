import { Injectable } from '@nestjs/common'
import { EmailService } from '../infrastructure/EmailService'

interface VerificationCode {
  code: string
  email: string
  expiresAt: Date
  attempts: number
}

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, VerificationCode> = new Map()
  private readonly MAX_ATTEMPTS = 3
  private readonly CODE_EXPIRY_MINUTES = 10

  constructor(private readonly emailService: EmailService) {}

  async sendVerificationCode(email: string): Promise<boolean> {
    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Stocker le code avec expiration
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES)

    this.verificationCodes.set(email, {
      code,
      email,
      expiresAt,
      attempts: 0,
    })

    // Envoyer le code par email via Amazon SES
    try {
      await this.emailService.sendVerificationCode(
        email,
        code,
        this.CODE_EXPIRY_MINUTES,
      )
      return true
    } catch (error) {
      console.error('Error sending email code:', error)
      throw new Error("Impossible d'envoyer le code de vérification")
    }
  }

  verifyCode(email: string, code: string): boolean {
    const storedData = this.verificationCodes.get(email)

    if (!storedData) {
      throw new Error('Aucun code de vérification trouvé pour cet email')
    }

    // Vérifier l'expiration
    if (new Date() > storedData.expiresAt) {
      this.verificationCodes.delete(email)
      throw new Error('Le code de vérification a expiré')
    }

    // Vérifier le nombre de tentatives
    if (storedData.attempts >= this.MAX_ATTEMPTS) {
      this.verificationCodes.delete(email)
      throw new Error('Trop de tentatives. Demandez un nouveau code.')
    }

    // Incrémenter les tentatives
    storedData.attempts++

    // Vérifier le code
    if (storedData.code !== code) {
      return false
    }

    // Code valide - le supprimer
    this.verificationCodes.delete(email)
    return true
  }

  // Nettoyer les codes expirés périodiquement
  cleanExpiredCodes(): void {
    const now = new Date()
    for (const [email, data] of this.verificationCodes.entries()) {
      if (now > data.expiresAt) {
        this.verificationCodes.delete(email)
      }
    }
  }
}

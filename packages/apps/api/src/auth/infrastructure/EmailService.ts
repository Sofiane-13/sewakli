import { Injectable } from '@nestjs/common'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

@Injectable()
export class EmailService {
  private sesClient: SESClient | null = null
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production'

    // Initialiser le client AWS SES uniquement en production
    if (!this.isDevelopment && process.env.AWS_ACCESS_KEY_ID) {
      this.sesClient = new SESClient({
        region: process.env.AWS_REGION || 'eu-west-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      })
    }
  }

  async sendVerificationCode(
    email: string,
    code: string,
    expiryMinutes: number = 10,
  ): Promise<void> {
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background-color: #0f66bd; color: #ffffff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 40px 30px; }
            .code-box { background-color: #f8f9fa; border: 2px solid #0f66bd; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f66bd; font-family: 'Courier New', monospace; }
            .info { color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; font-size: 14px; color: #856404; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Code de vérification</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p class="info">Vous avez demandé à publier un itinéraire. Veuillez utiliser le code de vérification ci-dessous pour confirmer votre adresse email :</p>

              <div class="code-box">
                <div class="code">${code}</div>
              </div>

              <p class="info">Ce code est valide pendant <strong>${expiryMinutes} minutes</strong>.</p>

              <div class="warning">
                ⚠️ Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
              </div>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>&copy; ${new Date().getFullYear()} Votre Application. Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textBody = `
Code de vérification : ${code}

Vous avez demandé à publier un itinéraire.
Utilisez ce code pour confirmer votre adresse email.

Ce code est valide pendant ${expiryMinutes} minutes.

Si vous n'avez pas demandé ce code, ignorez cet email.
    `

    const params = {
      Source: process.env.AWS_SES_FROM_EMAIL || 'noreply@example.com',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: `Votre code de vérification : ${code}`,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
        },
      },
    }

    try {
      // Mode développement : simuler l'envoi et afficher le code dans les logs
      if (this.isDevelopment) {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║           CODE DE VÉRIFICATION (DÉVELOPPEMENT)             ║
╠════════════════════════════════════════════════════════════╣
║  Email: ${email.padEnd(48)} ║
║  Code:  ${code.padEnd(48)} ║
║  Expire dans: ${expiryMinutes} minutes${' '.repeat(38)} ║
╚════════════════════════════════════════════════════════════╝
        `)
        return
      }

      // Mode production : envoyer via AWS SES
      if (!this.sesClient) {
        throw new Error(
          "AWS SES non configuré. Vérifiez vos variables d'environnement.",
        )
      }

      const command = new SendEmailCommand(params)
      await this.sesClient.send(command)
      console.log(`[Email] Verification code sent to ${email}`)
    } catch (error) {
      console.error('[Email] Error sending verification code:', error)
      throw new Error("Impossible d'envoyer l'email de vérification")
    }
  }
}

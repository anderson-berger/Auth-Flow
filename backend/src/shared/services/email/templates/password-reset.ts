// backend/src/features/email/templates/password-reset.ts
import { PasswordResetData, EmailResult } from "../email-schemas";

export function passwordResetTemplate(data: PasswordResetData): EmailResult {
  return {
    subject: "Redefinir senha - AuthFlow",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h1 style="color: #333; margin-bottom: 20px;">Olá ${data.userName}! 🔐</h1>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Recebemos uma solicitação para redefinir a senha da sua conta no <strong>AuthFlow</strong>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetUrl}" 
                 style="background: #dc3545; color: white; padding: 14px 32px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;
                        font-weight: 600; font-size: 16px;">
                Redefinir Senha
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Ou use este token:
            </p>
            <code style="background: #e9ecef; padding: 10px; border-radius: 4px; display: block; 
                         word-break: break-all; font-size: 12px;">
              ${data.resetToken}
            </code>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px;">
              Se você não solicitou a redefinição de senha, ignore este email. Seu senha permanecerá inalterada.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Olá ${data.userName}!

Recebemos uma solicitação para redefinir a senha da sua conta no AuthFlow.

Acesse o link abaixo para criar uma nova senha:
${data.resetUrl}

Ou use este token manualmente:
${data.resetToken}

Se você não solicitou a redefinição de senha, ignore este email.
    `.trim(),
  };
}

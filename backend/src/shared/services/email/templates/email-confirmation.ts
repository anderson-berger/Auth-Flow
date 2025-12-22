// backend/src/features/email/templates/email-confirmation.ts
import { EmailConfirmationData, EmailResult } from "../email-schemas";

export function emailConfirmationTemplate(data: EmailConfirmationData): EmailResult {
  return {
    subject: "Confirme seu email - AuthFlow",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h1 style="color: #333; margin-bottom: 20px;">Olá ${data.userName}! 👋</h1>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Bem-vindo ao <strong>AuthFlow</strong>. Para ativar sua conta, confirme seu email clicando no botão abaixo:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.confirmationUrl}" 
                 style="background: #007bff; color: white; padding: 14px 32px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;
                        font-weight: 600; font-size: 16px;">
                Confirmar Email
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Ou copie e cole este token manualmente:
            </p>
            <code style="background: #e9ecef; padding: 10px; border-radius: 4px; display: block; 
                         word-break: break-all; font-size: 12px;">
              ${data.confirmationToken}
            </code>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px;">
              Se você não criou uma conta no AuthFlow, ignore este email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Olá ${data.userName}!

Bem-vindo ao AuthFlow. Para ativar sua conta, confirme seu email acessando o link abaixo:

${data.confirmationUrl}

Ou use este token manualmente:
${data.confirmationToken}

Se você não criou uma conta no AuthFlow, ignore este email.
    `.trim(),
  };
}

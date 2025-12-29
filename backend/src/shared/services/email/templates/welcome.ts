// backend/src/features/email/templates/welcome.ts
import { WelcomeData, EmailResult } from "../email-schemas";

export function welcomeTemplate(data: WelcomeData): EmailResult {
  return {
    subject: "Bem-vindo ao AuthFlow! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h1 style="color: #333; margin-bottom: 20px;">Bem-vindo, ${data.userName}! 🎉</h1>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Sua conta foi confirmada com sucesso! Agora você tem acesso completo ao <strong>AuthFlow</strong>.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Explore todas as funcionalidades e aproveite!
            </p>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px;">
              Equipe AuthFlow
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Bem-vindo, ${data.userName}!

Sua conta foi confirmada com sucesso! Agora você tem acesso completo ao AuthFlow.

Explore todas as funcionalidades e aproveite!

Equipe AuthFlow
    `.trim(),
  };
}

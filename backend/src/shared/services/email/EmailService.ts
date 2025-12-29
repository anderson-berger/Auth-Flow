// backend/src/features/email/EmailService.ts
import { EmailPayload, EmailResult, $emailPayload } from "./email-schemas";
import { emailConfirmationTemplate, passwordResetTemplate, welcomeTemplate } from "./templates";

export class EmailService {
  async send(payload: EmailPayload): Promise<void> {
    const validatedPayload = $emailPayload.parse(payload);

    const emailContent = this.resolveTemplate(validatedPayload);

    await this.sendEmail(validatedPayload.to, emailContent);
  }

  private resolveTemplate(payload: EmailPayload): EmailResult {
    switch (payload.type) {
      case "CONFIRMATION":
        return emailConfirmationTemplate(payload.data);

      case "PASSWORD_RESET":
        return passwordResetTemplate(payload.data);

      case "WELCOME":
        return welcomeTemplate(payload.data);

      default:
        const exhaustiveCheck: never = payload;
        throw new Error(`Unhandled email type: ${exhaustiveCheck}`);
    }
  }

  private async sendEmail(to: string, content: EmailResult): Promise<void> {
    const stage = process.env.STAGE || "local";

    if (stage === "local") {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📧 EMAIL SENT (DEV MODE)");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("To:", to);
      console.log("Subject:", content.subject);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(content.text);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      return;
    }

    // staging/prod: SES real
    await this.sendViaSES(to, content);
  }

  private async sendViaSES(to: string, content: EmailResult): Promise<void> {
    // TODO: Implementar SES real
    console.log("📧 Sending via SES to:", to);
  }
}

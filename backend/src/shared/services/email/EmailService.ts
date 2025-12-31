import { EmailPayload, EmailResult, $emailPayload } from "@src/shared/services/email/email-schemas";
import { emailConfirmationTemplate, passwordResetTemplate, welcomeTemplate } from "./templates";
import { EmailProvider } from "./EmailProvider";
import { InternalServerError } from "@src/shared/errors/errors";

export class EmailService {
  constructor(private readonly provider: EmailProvider) {}

  async send(payload: EmailPayload): Promise<void> {
    const validated = $emailPayload.parse(payload);

    const content = this.resolveTemplate(validated);

    await this.provider.send({
      to: validated.to,
      content,
    });
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
        // Nunca deve acontecer por causa do Zod,
        // mas protege contra uso indevido
        throw new InternalServerError("Unsupported email type");
    }
  }
}

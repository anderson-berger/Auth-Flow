import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { EmailSendInput } from "./email-schemas";
import { env } from "@src/shared/config/env";
import { InternalServerError } from "@src/shared/errors/errors";

export interface EmailProvider {
  send(input: EmailSendInput): Promise<void>;
}

export class EmailProviderSES implements EmailProvider {
  private readonly sesClient: SESClient;

  constructor() {
    const region = env.SES_REGION;

    this.sesClient = new SESClient(
      env.STAGE === "local"
        ? {
            region,
            endpoint: "http://localstack:4566",
            credentials: {
              accessKeyId: "test",
              secretAccessKey: "test",
            },
          }
        : { region }
    );
  }

  async send({ to, content }: EmailSendInput): Promise<void> {
    const params: SendEmailCommandInput = {
      Source: `${env.SES_FROM_NAME} <${env.SES_FROM_EMAIL}>`,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: content.subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: content.text,
            Charset: "UTF-8",
          },
          Html: {
            Data: content.html,
            Charset: "UTF-8",
          },
        },
      },
    };
    console.log("text", content.text);
    try {
      await this.sesClient.send(new SendEmailCommand(params));
    } catch (error) {
      throw new InternalServerError("Failed to send email");
    }
  }
}

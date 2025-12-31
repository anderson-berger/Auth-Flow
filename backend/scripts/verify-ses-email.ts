import { SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { env } from "../src/shared/config/env";
import { InternalServerError } from "../src/shared/errors/errors";

const sesClient = new SESClient({
  region: env.SES_REGION,
  endpoint: "http://localstack:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

// o comando VerifyEmailIdentityCommand cria uma entidade no localstack.
async function verifyEmail(email: string) {
  try {
    await sesClient.send(
      new VerifyEmailIdentityCommand({
        EmailAddress: email,
      })
    );

    console.log(`✅ Email ${email} verificado com sucesso no SES LocalStack!`);
  } catch (error) {
    throw new InternalServerError(`Failed to verify SES email identity for ${email}`);
  }
}

verifyEmail(env.SES_FROM_EMAIL);

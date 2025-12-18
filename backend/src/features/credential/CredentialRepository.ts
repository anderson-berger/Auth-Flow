// credential_repository.ts

import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "@src/shared/database/dynamodb-client";
import { $credential, Credential } from "@src/features/credential/credential-schemas";

const TABLE = process.env.TABLE!;

export class CredentialRepository {
  constructor() {}

  async save(credential: Credential): Promise<void> {
    await dynamoDBClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          pk: `USER#${credential.userId}`,
          sk: "CREDENTIAL",

          gsi1pk: "CREDENTIAL",
          gsi1sk: credential.createdAt,
          ...credential,
        },
      })
    );
  }

  async getByUserId(userId: string): Promise<Credential | null> {
    const result = await dynamoDBClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: {
          pk: `USER#${userId}`,
          sk: "CREDENTIAL",
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return $credential.parse(result.Item);
  }
}

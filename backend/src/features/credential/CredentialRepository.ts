// backend/src/features/credential/CredentialRepository.ts
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "@src/shared/database/dynamodb-client";
import { $credential, Credential } from "@src/features/credential/credential-schemas";
import { env } from "@src/shared/config/env";
import { buildUpdateExpression } from "@src/shared/database/dynamodb-utils";

const TABLE = env.TABLE;

export class CredentialRepository {
  constructor() {}

  /**
   * Salva credencial (create ou replace)
   */
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
        ConditionExpression: "attribute_not_exists(pk)",
      })
    );
  }

  /**
   * Busca credencial por userId
   */
  async getByUserId(userId: string): Promise<Credential | undefined> {
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
      return undefined;
    }

    return $credential.parse(result.Item);
  }

  async patch(userId: string, updates: Partial<Credential>): Promise<void> {
    const { updateExpression, expressionAttributeNames, expressionAttributeValues } =
      buildUpdateExpression(updates);

    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: {
          pk: `USER#${userId}`,
          sk: "CREDENTIAL",
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(pk)",
      })
    );
  }
}

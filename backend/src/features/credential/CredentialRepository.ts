// backend/src/features/credential/CredentialRepository.ts
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "@src/shared/database/dynamodb-client";
import { $credential, Credential } from "@src/features/credential/credential-schemas";
import dayjs from "dayjs";

const TABLE = process.env.TABLE!;

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

  async patch(userId: string, updates: Partial<Credential>): Promise<void> {
    const updateExpressions: string[] = [];
    const attributeNames: Record<string, string> = {};
    const attributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value], index) => {
      const placeholder = `#attr${index}`;
      const valuePlaceholder = `:val${index}`;

      updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
      attributeNames[placeholder] = key;
      attributeValues[valuePlaceholder] = value;
    });

    // updatedAt automático
    updateExpressions.push("#updatedAt = :updatedAt");
    attributeNames["#updatedAt"] = "updatedAt";
    attributeValues[":updatedAt"] = dayjs().toISOString();

    // version automático
    updateExpressions.push("#version = #version + :inc");
    attributeNames["#version"] = "version";
    attributeValues[":inc"] = 1;

    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: {
          pk: `USER#${userId}`,
          sk: "CREDENTIAL",
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: attributeNames,
        ExpressionAttributeValues: attributeValues,
        ConditionExpression: "attribute_exists(pk)",
      })
    );
  }
}

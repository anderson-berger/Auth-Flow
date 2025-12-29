// backend/src/features/user/UserRepository.ts
import { dynamoDBClient } from "@src/shared/database/dynamodb-client";
import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { $user, User } from "@src/features/user/user-schemas";

const TABLE = process.env.TABLE!;

export class UserRepository {
  constructor() {}

  async save(user: User): Promise<void> {
    await dynamoDBClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          pk: `USER#${user.id}`,
          sk: "METADATA",
          // Para listar todos os USERS
          gsi1pk: "USER",
          gsi1sk: user.createdAt,
          // Para dar GetByEmail
          gsi2pk: user.email.toLowerCase(),
          gsi2sk: "USER",
          ...user,
        },
        ConditionExpression: "attribute_not_exists(pk)",
      })
    );
  }

  async getById(userId: User["id"]): Promise<User | null> {
    const result = await dynamoDBClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: {
          pk: `USER#${userId}`,
          sk: "METADATA",
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return $user.parse(result.Item);
  }

  async getByEmail(email: User["email"]): Promise<User | null> {
    const result = await dynamoDBClient.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI2",
        KeyConditionExpression: "gsi2pk = :email",
        ExpressionAttributeValues: {
          ":email": email.toLowerCase(),
        },
        Limit: 1,
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return $user.parse(result.Items[0]);
  }

  async patch(userId: string, updates: Partial<User>): Promise<void> {
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

    updateExpressions.push("#version = #version + :inc");
    attributeNames["#version"] = "version";
    attributeValues[":inc"] = 1;

    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: {
          pk: `USER#${userId}`,
          sk: "METADATA",
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: attributeNames,
        ExpressionAttributeValues: attributeValues,
        ConditionExpression: "attribute_exists(pk)",
      })
    );
  }

  async update(user: User): Promise<void> {
    await dynamoDBClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          pk: `USER#${user.id}`,
          sk: "METADATA",
          gsi1pk: "USER",
          gsi1sk: user.createdAt,
          gsi2pk: user.email.toLowerCase(),
          gsi2sk: "USER",
          ...user,
        },
      })
    );
  }
}

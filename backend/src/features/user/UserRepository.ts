import { dynamoDBClient } from "@src/shared/database/dynamodb-client";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
          //Para Lista todos os USERS
          gsi1pk: "USER",
          gsi1sk: user.createdAt,
          //Para dar GetByEmail
          gsi2pk: user.email,
          gsi2sk: "USER",
          ...user,
        },
        ConditionExpression: "attribute_not_exists(pk)",
      })
    );
  }

  async getById(userId: string) {
    const result = await dynamoDBClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: {
          pk: `USER#${userId}`,
          sk: "PROFILE",
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
}

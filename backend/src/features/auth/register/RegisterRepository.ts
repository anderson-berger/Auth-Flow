import { dynamoDBClient } from "@src/shared/database/dynamodb-client";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "@src/features/user/user-schemas";
import { Credential } from "@src/features/credential/credential-schemas";
import { env } from "@src/shared/config/env";

const TABLE = env.TABLE;

export class RegisterRepository {
  /**
   * Atomically creates both user and credential in a single transaction.
   * If either operation fails, both are rolled back.
   */
  async createUserWithCredential(user: User, credential: Credential): Promise<void> {
    await dynamoDBClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
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
              ConditionExpression: "attribute_not_exists(pk)",
            },
          },
          {
            Put: {
              TableName: TABLE,
              Item: {
                pk: `USER#${credential.userId}`,
                sk: "CREDENTIAL",
                gsi1pk: `CREDENTIAL#${credential.userId}`,
                gsi1sk: credential.createdAt,
                ...credential,
              },
              ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
            },
          },
        ],
      })
    );
  }
}

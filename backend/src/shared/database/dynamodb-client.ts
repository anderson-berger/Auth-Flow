import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const stage = process.env.STAGE || "local";
const isLocal = stage.toLowerCase() === "local";

const clientConfig: DynamoDBClientConfig = {
  region: process.env.AWS_REGION || "sa-east-1",
};

if (isLocal) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT || "http://localstack:4566";
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  };
}

const client = new DynamoDBClient(clientConfig);

export const dynamoDBClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

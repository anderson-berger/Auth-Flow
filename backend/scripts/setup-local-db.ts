import { CreateTableCommand, DescribeTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "sa-east-1",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localstack:4566",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});

const TABLE = process.env.TABLE || "authflow-local"; // ← CORRIGIR AQUI

async function ensureTable() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE }));
    console.log(`✅ Tabela ${TABLE} já existe.`);
    return;
  } catch (e: any) {
    if (e.name !== "ResourceNotFoundException") throw e;
  }

  console.log(`📦 Criando tabela ${TABLE}…`);

  const cmd = new CreateTableCommand({
    TableName: TABLE,
    BillingMode: "PAY_PER_REQUEST",

    AttributeDefinitions: [
      { AttributeName: "pk", AttributeType: "S" },
      { AttributeName: "sk", AttributeType: "S" },
      { AttributeName: "gsi1pk", AttributeType: "S" },
      { AttributeName: "gsi1sk", AttributeType: "S" },
      { AttributeName: "gsi2pk", AttributeType: "S" },
      { AttributeName: "gsi2sk", AttributeType: "S" },
      { AttributeName: "gsi3pk", AttributeType: "S" },
      { AttributeName: "gsi3sk", AttributeType: "S" },
    ],

    KeySchema: [
      { AttributeName: "pk", KeyType: "HASH" },
      { AttributeName: "sk", KeyType: "RANGE" },
    ],

    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI1",
        KeySchema: [
          { AttributeName: "gsi1pk", KeyType: "HASH" },
          { AttributeName: "gsi1sk", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "GSI2",
        KeySchema: [
          { AttributeName: "gsi2pk", KeyType: "HASH" },
          { AttributeName: "gsi2sk", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "GSI3",
        KeySchema: [
          { AttributeName: "gsi3pk", KeyType: "HASH" },
          { AttributeName: "gsi3sk", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  });

  await client.send(cmd);
  console.log("✅ Tabela criada com sucesso!");
}

ensureTable().catch((e) => {
  console.error("❌ Erro ao criar tabela:", e);
  process.exit(1);
});

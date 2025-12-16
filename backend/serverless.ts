import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "authflow-backend",
  frameworkVersion: "4",

  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "sa-east-1",
    stage: '${opt:stage, "dev"}',
    memorySize: 256,
    timeout: 30,

    // Variáveis de ambiente globais
    environment: {
      STAGE: "${self:provider.stage}",
      SERVICE_NAME: "${self:service}",
    },
  },

  // Build nativo do Serverless 4
  build: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: "node18",
      platform: "node",
      exclude: ["aws-sdk"],
    },
  },

  // Plugins
  plugins: ["serverless-offline"],

  // Configurações customizadas
  custom: {
    // Configuração do serverless-offline
    "serverless-offline": {
      httpPort: 3000,
      host: "0.0.0.0",
      noPrependStageInUrl: true,
    },
  },

  // Functions (Lambdas)
  functions: {
    health: {
      handler: "src/features/health/handler.handler",
      events: [
        {
          http: {
            path: "/health",
            method: "GET",
            cors: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;

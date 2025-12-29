import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "authflow",
  frameworkVersion: "4",

  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "sa-east-1",
    stage: '${opt:stage, "local"}',
    memorySize: 256,
    timeout: 30,

    // Variáveis de ambiente globais
    environment: {
      STAGE: "${self:provider.stage}",
      SERVICE_NAME: "${self:service}",
      TABLE: "${self:service}-${opt:stage, 'local'}",
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
          httpApi: {
            path: "/health",
            method: "GET",
          },
        },
      ],
    },
    login: {
      handler: "src/features/auth/login/handler.handler",
      events: [
        {
          httpApi: {
            path: "/auth/login",
            method: "POST",
          },
        },
      ],
    },
    register: {
      handler: "src/features/auth/register/handler.handler",
      events: [
        {
          httpApi: {
            path: "/auth/register",
            method: "POST",
          },
        },
      ],
    },
    confirmation: {
      handler: "src/features/auth/confirmation/handler.handler",
      events: [
        {
          httpApi: {
            path: "/auth/confirm-email",
            method: "GET",
          },
        },
      ],
    },
    refresh: {
      handler: "src/features/auth/refresh/handler.handler",
      events: [
        {
          httpApi: {
            path: "/auth/refresh",
            method: "POST",
          },
        },
      ],
    },
    credentialReset: {
      handler: "src/features/credential/handler.handler",
      events: [
        {
          httpApi: {
            path: "/api/credential",
            method: "post",
          },
        },
        {
          httpApi: {
            path: "/api/credential",
            method: "put",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;

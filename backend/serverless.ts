import type { AWS } from "@serverless/typescript";
//TODO: Criar extensão de tipos personalizada e validar configuração com Zod, para nao precisa usar o @ts-ignore alem de ter um orientação e documentação melhor.
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
      TABLE: "${self:service}-${opt:stage, 'local'}",
    },
    httpApi: {
      cors: {
        allowedOrigins: ["http://localhost:9000"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
        allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowCredentials: true,
        maxAge: 300,
      },
      authorizers: {
        authLambda: {
          type: "request",
          functionName: "authorizer",
          identitySource: ["$request.header.Authorization"],
          enableSimpleResponses: false,
        },
      },
    },

    // IAM Permissions
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource:
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE}",
          },
          {
            Effect: "Allow",
            Action: ["ses:SendEmail", "ses:SendRawEmail"],
            Resource: "*",
          },
        ],
      },
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
  plugins: ["serverless-offline", "serverless-apigateway-route-settings"],
  // limitação com o throttling: não é possível testá-lo no stage local.
  // posso criar um Middleware para simular mas nao gosto da ideia, ou posso testar em dev :/

  // Configurações customizadas
  custom: {
    "serverless-offline": {
      httpPort: 3000,
      host: "0.0.0.0",
      noPrependStageInUrl: true,
    },
    "serverless-apigateway-route-settings": {
      burstLimit: 200,
      rateLimit: 400,
      detailedMetricsEnabled: true,
    },
  },

  // Functions (Lambdas)
  functions: {
    authorizer: {
      handler: "src/shared/middleware/authorize.handler",
      description: "JWT authorizer for HTTP API",
    },
    health: {
      handler: "src/features/health/handler.handler",
      events: [
        {
          httpApi: {
            path: "/api/health",
            method: "GET",
            authorizer: {
              name: "authLambda",
            },
          },
        },
      ],
    },
    login: {
      handler: "src/features/auth/login/handler.handler",
      events: [
        {
          httpApi: {
            path: "/api/auth/login",
            method: "POST",
            //TODO: depois de criar a interface personalizada remover o ts-ignore
            // @ts-ignore - serverless-apigateway-route-settings adiciona essa propriedade
            routeSettings: {
              rateLimit: 50,
              burstLimit: 100,
            },
          },
        },
      ],
    },
    register: {
      handler: "src/features/auth/register/handler.handler",
      events: [
        {
          httpApi: {
            path: "/api/auth/register",
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
            path: "/api/auth/confirm-email",
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
            path: "/api/auth/refresh",
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

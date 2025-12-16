import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { apiSuccess, apiError } from "@/shared/response/response";
import { $loginRequest, type LoginResponse } from "./login-schemas";

/**
 * Login Handler
 *
 * Endpoint: POST /auth/login
 * Autentica usuário e retorna tokens JWT
 */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    // 1. Parse e validação com Zod
    const input = $loginRequest.parse(JSON.parse(event.body || "{}"));

    // 2. TODO: Buscar usuário no banco
    // Por enquanto, mock de dados
    console.log("Login attempt:", { email: input.email, password: "***" });

    // 3. TODO: Verificar senha com bcrypt
    // Por enquanto, aceitar qualquer senha

    // 4. TODO: Gerar JWT tokens
    // Por enquanto, mock de tokens
    const result: LoginResponse = {
      accessToken: "mock-access-token-12345",
      refreshToken: "mock-refresh-token-67890",
      user: {
        id: "user-123",
        email: input.email,
        name: "Mock User",
      },
    };

    return apiSuccess(result, 200);
  } catch (error) {
    return apiError(error);
  }
}

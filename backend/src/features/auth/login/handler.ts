import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { $loginRequest } from "@src/features/auth/login/login-schemas";
import { LoginService } from "@src/features/auth/login/LoginService";
import { apiError, apiSuccess } from "@src/shared/response/response";

const loginService = new LoginService();

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const input = $loginRequest.parse(body);

    const result = await loginService.execute(input);

    return apiSuccess(result, 200);
  } catch (error) {
    return apiError(error);
  }
}

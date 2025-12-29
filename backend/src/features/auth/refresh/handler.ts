// backend/src/features/auth/refresh/refresh-handler.ts
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { $refreshTokenRequest } from "./refresh-schemas";
import { RefreshService } from "./RefreshService";
import { apiError, apiSuccess } from "@src/shared/response/response";

const refreshService = new RefreshService();

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  //TODO: implementar refresh via cookies ou via header
  try {
    const body = JSON.parse(event.body || "{}");
    const input = $refreshTokenRequest.parse(body);

    const result = await refreshService.execute(input);

    return apiSuccess(result, 200);
  } catch (error) {
    return apiError(error);
  }
}

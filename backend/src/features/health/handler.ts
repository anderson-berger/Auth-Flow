import { apiError, apiSuccess } from "@/shared/response/response";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

/**
 * Health Check Handler
 *
 * Endpoint: GET /health
 * Returns service status
 */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "AuthFlow API",
      version: "0.1.0",
    };

    return apiSuccess(healthData);
  } catch (error) {
    return apiError(error);
  }
}

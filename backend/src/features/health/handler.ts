import { apiSuccess } from "@/shared/response/response";
import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async () => {
  return apiSuccess({
    status: "healthy",
    service: "url-shortener",
    version: process.env.VERSION || "1.0.0",
    timestamp: new Date().toISOString(),
  });
};

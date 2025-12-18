import type { APIGatewayProxyResultV2 } from "aws-lambda";
import { ZodError } from "zod";
import { AppError } from "../errors/errors";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
};

/**
 * Success response
 */
export const apiSuccess = <T>(data: T, statusCode = 200): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(data),
});

/**
 * Redirect response (useful for OAuth flows)
 */
export const apiRedirect = (
  location: string,
  statusCode: 301 | 302 = 302
): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: {
    Location: location,
    "Cache-Control": "no-cache",
  },
  body: "",
});

/**
 * Error response with proper status codes
 */
export const apiError = (error: unknown): APIGatewayProxyResultV2 => {
  console.error("API Error:", error);

  // Zod validation error
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Validation error",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      }),
    };
  }

  // Custom AppError (uses statusCode from error)
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.name,
        message: error.message,
      }),
    };
  }

  // Generic Error
  if (error instanceof Error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }

  // Unknown error
  return {
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify({
      error: "Internal server error",
      message: "Unknown error",
    }),
  };
};

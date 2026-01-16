import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { apiError, apiSuccess } from "@src/shared/response/response";
import { verifyAccessToken } from "@src/shared/middleware/auth-middleware";
import { UserService } from "./UserService";

const userService = new UserService();

/**
 * Get current user profile (protected endpoint example)
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    // Verify access token (reconstructed from Authorization header + cookie)
    const tokenPayload = await verifyAccessToken(event);

    // Get user data
    const user = await userService.findById(tokenPayload.userId);

    if (!user) {
      return apiError(new Error("User not found"));
    }

    // Return user data (excluding sensitive info)
    const { id, email, status, createdAt, updatedAt } = user;

    return apiSuccess({
      id,
      email,
      status,
      createdAt,
      updatedAt,
    });
  } catch (error) {
    return apiError(error);
  }
}

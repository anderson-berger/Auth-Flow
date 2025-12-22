// backend/src/features/auth/confirmation/confirmation-handler.ts
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { $confirmEmailRequest } from "@src/features/auth/confirmation/confirmation-schemas";
import { ConfirmationService } from "@src/features/auth/confirmation/ConfirmationService";
import { apiError, apiSuccess } from "@src/shared/response/response";
import { BadRequestError } from "@src/shared/errors/errors";

const confirmationService = new ConfirmationService();

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    // Parse query string parameters (token vem na URL)
    const token = event.queryStringParameters?.token;

    if (!token) {
      throw new BadRequestError("Missing confirmation token");
    }

    // Valida o input
    const input = $confirmEmailRequest.parse({ token });

    // Executa confirmação
    const result = await confirmationService.execute(input);

    return apiSuccess(result, 200);
  } catch (error) {
    return apiError(error);
  }
}

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { $registerRequest } from "@src/features/auth/register/register-schemas";
import { RegisterService } from "@src/features/auth/register/RegisterService";
import { apiError, apiSuccess } from "@src/shared/response/response";
import { parseRequestBody } from "@src/shared/utils/parse-body";

const registerService = new RegisterService();

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const body = parseRequestBody(event.body);
    const registerRequest = $registerRequest.parse(body);

    const result = await registerService.execute(registerRequest);

    return apiSuccess(result, 201);
  } catch (error) {
    return apiError(error);
  }
}

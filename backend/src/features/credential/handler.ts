import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { apiError, apiSuccess } from "@src/shared/response/response";
import { CredentialService } from "@src/features/credential/CredentialService";
import {
  $requestCredentialReset,
  $resetCredential,
} from "@src/features/credential/credential-schemas";
import { BadRequestError } from "@src/shared/errors/errors";

const credentialService = new CredentialService();

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const method = event.requestContext.http.method;

    switch (method) {
      case "POST":
        return await post(event);
      case "PUT":
        return await put(event);

      default:
        throw new BadRequestError("HTTP method not supported");
    }
  } catch (error) {
    return apiError(error);
  }
}

async function post(event: APIGatewayProxyEventV2) {
  const body = JSON.parse(event.body || "{}");
  const input = $requestCredentialReset.parse(body);
  const result = await credentialService.requestCredentialReset(input);
  return apiSuccess(result, 200);
}

async function put(event: APIGatewayProxyEventV2) {
  const body = JSON.parse(event.body || "{}");
  const input = $resetCredential.parse(body);
  const result = await credentialService.credentialReset(input);
  return apiSuccess(result, 200);
}

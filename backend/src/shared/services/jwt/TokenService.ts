import { SignJWT, jwtVerify } from "jose";
import { UnauthorizedError } from "@src/shared/errors/errors";
import { env } from "@src/shared/config/env";
import { TokenPayload } from "@src/shared/services/jwt/jwt-schemas";

export class TokenService {
  private readonly jwtSecret: Uint8Array;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly confirmationTokenExpiry: string;
  private readonly credentialResetTokenExpiry: string;

  constructor() {
    this.jwtSecret = new TextEncoder().encode(env.JWT_SECRET);
    this.accessTokenExpiry = env.JWT_ACCESS_TOKEN_EXPIRY;
    this.refreshTokenExpiry = env.JWT_REFRESH_TOKEN_EXPIRY;
    this.confirmationTokenExpiry = env.JWT_CONFIRMATION_TOKEN_EXPIRY;
    this.credentialResetTokenExpiry = env.JWT_CREDENTIAL_RESET_TOKEN_EXPIRY;
  }

  async generateAccessToken(tokenPayload: TokenPayload): Promise<string> {
    return await new SignJWT({ ...tokenPayload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(this.accessTokenExpiry)
      .sign(this.jwtSecret);
  }

  async generateRefreshToken(tokenPayload: TokenPayload): Promise<string> {
    return await new SignJWT({ ...tokenPayload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(this.refreshTokenExpiry)
      .sign(this.jwtSecret);
  }

  async generateEmailConfirmationToken(payload: TokenPayload) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(this.confirmationTokenExpiry)
      .sign(this.jwtSecret);
  }

  async generatePasswordResetToken(payload: TokenPayload) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(this.credentialResetTokenExpiry)
      .sign(this.jwtSecret);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwtSecret);
      return {
        userId: payload.userId as string,
        email: payload.email as string,
      };
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}

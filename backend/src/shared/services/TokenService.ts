import { SignJWT, jwtVerify } from "jose";

/**
 * Token payload structure
 */
export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Token Service
 *
 * Handles JWT token generation and verification using jose
 */
export class TokenService {
  private readonly jwtSecret: Uint8Array;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly confirmationTokenExpiry: string;

  constructor() {
    // Get from environment variables (with fallbacks for local dev)
    const secret = process.env.JWT_SECRET || "dev-secret-change-in-production";
    this.jwtSecret = new TextEncoder().encode(secret);
    this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m";
    this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d";
    this.confirmationTokenExpiry = process.env.JWT_CONFIRMATION_TOKEN_EXPIRY || "7d";
  }

  /**
   * Generate access token (short-lived)
   */
  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.accessTokenExpiry)
      .sign(this.jwtSecret);
  }

  /**
   * Generate refresh token (long-lived)
   */
  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.refreshTokenExpiry)
      .sign(this.jwtSecret);
  }

  /**
   * Generate confirmation token (short-lived)
   */
  async generateEmailConfirmationToken(payload: TokenPayload) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.confirmationTokenExpiry)
      .sign(this.jwtSecret);
  }

  /**
   * Verify and decode token
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwtSecret);
      return {
        userId: payload.userId as string,
        email: payload.email as string,
      };
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}

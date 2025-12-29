import { SignJWT, jwtVerify } from "jose";

export interface TokenPayload {
  userId: string;
  email: string;
}

export class TokenService {
  private readonly jwtSecret: Uint8Array;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly confirmationTokenExpiry: string;

  constructor() {
    const secret = process.env.JWT_SECRET || "dev-secret-change-in-production";
    this.jwtSecret = new TextEncoder().encode(secret);
    this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m";
    this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d";
    this.confirmationTokenExpiry = process.env.JWT_CONFIRMATION_TOKEN_EXPIRY || "7d";
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.accessTokenExpiry)
      .sign(this.jwtSecret);
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.refreshTokenExpiry)
      .sign(this.jwtSecret);
  }

  async generateEmailConfirmationToken(payload: TokenPayload) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.confirmationTokenExpiry)
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
      throw new Error("Invalid or expired token");
    }
  }
}

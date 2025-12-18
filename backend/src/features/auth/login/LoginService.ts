import type { LoginRequest, LoginResponse } from "./login-schemas";
import { InvalidCredentialsError } from "@src/shared/errors/errors";
import { CryptoService } from "@src/shared/services/CryptoService";
import { TokenService } from "@src/shared/services/TokenService";

/**
 * Login Service
 *
 * Handles authentication business logic
 */
export class LoginService {
  private tokenService: TokenService;
  private cryptoService: CryptoService;

  constructor() {
    this.tokenService = new TokenService();
    this.cryptoService = new CryptoService();
  }

  /**
   * Authenticate user with email and password
   */
  async execute(input: LoginRequest): Promise<LoginResponse> {
    // 1. Fetch user from database
    const user = await this.findUserByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    // 2. Verify password with bcrypt
    const isPasswordValid = await this.cryptoService.comparePassword(
      input.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    // 3. Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = await this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = await this.tokenService.generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        version: 1,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Find user by email
   * TODO: Replace with DynamoDB query
   */
  private async findUserByEmail(email: string) {
    // Mock user data
    // In production, this would query DynamoDB
    console.log("Finding user:", email);

    // Mock password: "senha123"
    // Hash generated with bcrypt.hash("senha123", 10)
    const mockPasswordHash = "$2b$10$OmIXTsUPhh0YvRHB.hJNsevPl8tpPiRg2RZ6S9CGmYteDqHHSbo4G";

    return {
      id: "user-123",
      email: email,
      name: "Mock User",
      passwordHash: mockPasswordHash,
    };
  }
}

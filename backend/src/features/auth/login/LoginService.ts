// backend/src/features/auth/login/LoginService.ts
import { UserService } from "@src/features/user/UserService";
import type { LoginRequest, LoginResponse } from "./login-schemas";
import { InvalidCredentialsError, UnauthorizedError } from "@src/shared/errors/errors";
import { CryptoService } from "@src/shared/services/CryptoService";
import { TokenService } from "@src/shared/services/TokenService";
import { CredentialService } from "@src/features/credential/CredentialService";

/**
 * Login Service
 *
 * Handles authentication business logic
 */
export class LoginService {
  private tokenService: TokenService;
  private cryptoService: CryptoService;
  private userService: UserService;
  private credentialService: CredentialService;

  constructor() {
    this.tokenService = new TokenService();
    this.cryptoService = new CryptoService();
    this.userService = new UserService();
    this.credentialService = new CredentialService();
  }

  /**
   * Authenticate user with email and password
   */
  async execute(input: LoginRequest): Promise<LoginResponse> {
    // 1. Busca usuário pelo email
    const user = await this.userService.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    // 2. Valida se o email foi confirmado
    if (user.status === "PENDING") {
      throw new UnauthorizedError("Email not confirmed. Please check your email.");
    }

    // 3. Valida se a conta está ativa
    if (user.status === "BLOCKED" || user.status === "SUSPENDED" || user.status === "DELETED") {
      throw new UnauthorizedError("Account is not active. Please contact support.");
    }

    // 4. Busca credencial do usuário
    const credential = await this.credentialService.getByUserId(user.id);

    if (!credential) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    // 5. Verifica senha com bcrypt
    const isPasswordValid = await this.cryptoService.comparePassword(
      input.password,
      credential.passwordHash
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    // 6. Gera tokens JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = await this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = await this.tokenService.generateRefreshToken(tokenPayload);

    // 7. Retorna resposta
    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

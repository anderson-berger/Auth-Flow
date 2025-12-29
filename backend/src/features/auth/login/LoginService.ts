// backend/src/features/auth/login/LoginService.ts
import { UserService } from "@src/features/user/UserService";
import type { LoginRequest, LoginResponse } from "./login-schemas";
import { InvalidCredentialsError, UnauthorizedError } from "@src/shared/errors/errors";
import { CryptoService } from "@src/shared/services/CryptoService";
import { TokenService } from "@src/shared/services/jwt/TokenService";
import { CredentialService } from "@src/features/credential/CredentialService";

interface LoginServiceDependencies {
  tokenService?: TokenService;
  cryptoService?: CryptoService;
  userService?: UserService;
  credentialService?: CredentialService;
}

export class LoginService {
  private tokenService: TokenService;
  private cryptoService: CryptoService;
  private userService: UserService;
  private credentialService: CredentialService;

  constructor(dependencies?: LoginServiceDependencies) {
    this.tokenService = dependencies?.tokenService ?? new TokenService();
    this.cryptoService = dependencies?.cryptoService ?? new CryptoService();
    this.userService = dependencies?.userService ?? new UserService();
    this.credentialService = dependencies?.credentialService ?? new CredentialService();
  }

  async execute(input: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    if (user.status === "PENDING") {
      throw new UnauthorizedError("Email not confirmed. Please check your email.");
    }

    if (user.status === "BLOCKED" || user.status === "SUSPENDED" || user.status === "DELETED") {
      throw new UnauthorizedError("Account is not active. Please contact support.");
    }

    const credential = await this.credentialService.getByUserId(user.id);

    if (!credential) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    const isPasswordValid = await this.cryptoService.comparePassword(
      input.password,
      credential.passwordHash
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError("Invalid credentials");
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = await this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = await this.tokenService.generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

// backend/src/features/auth/refresh/RefreshService.ts
import { TokenService } from "@src/shared/services/jwt/TokenService";
import { UserService } from "@src/features/user/UserService";
import { NotFoundError, UnauthorizedError } from "@src/shared/errors/errors";
import type {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@src/features/auth/refresh/refresh-schemas";

export class RefreshService {
  private tokenService: TokenService;
  private userService: UserService;

  constructor() {
    this.tokenService = new TokenService();
    this.userService = new UserService();
  }

  async execute(input: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const payload = await this.tokenService.verifyToken(input.refreshToken);

    if (!payload) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const user = await this.userService.findById(payload.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("User account is not active");
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
    };
  }
}

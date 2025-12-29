// backend/src/features/auth/reset-credential/RequestPasswordResetService.ts
import { UserService } from "@src/features/user/UserService";
import { TokenService } from "@src/shared/services/jwt/TokenService";
import { EmailService } from "@src/shared/services/email/EmailService";
import type {
  RequestCredentialResetRequest,
  RequestCredentialResetResponse,
} from "@src/features/auth/request-credential-reset/request-credential-reset-schemas";

export class RequestCredentialResetService {
  private userService: UserService;
  private tokenService: TokenService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.emailService = new EmailService();
  }

  async execute(input: RequestCredentialResetRequest): Promise<RequestCredentialResetResponse> {
    const user = await this.userService.findByEmail(input.email);

    if (!user) {
      return {
        message: "If this email exists, a password reset link has been sent.",
        email: input.email,
      };
    }

    if (user.status !== "ACTIVE") {
      return {
        message: "If this email exists, a password reset link has been sent.",
        email: input.email,
      };
    }

    const resetToken = await this.tokenService.generatePasswordResetToken({
      userId: user.id,
      email: user.email,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await this.emailService.send({
      type: "PASSWORD_RESET",
      to: user.email,
      data: {
        userName: user.name,
        resetToken,
        resetUrl,
      },
    });

    return {
      message: "If this email exists, a password reset link has been sent.",
      email: input.email,
    };
  }
}

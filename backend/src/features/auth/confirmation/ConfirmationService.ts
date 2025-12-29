// backend/src/features/auth/confirmation/ConfirmationService.ts
import { ConfirmEmailRequest, ConfirmEmailResponse } from "./confirmation-schemas";
import { UserService } from "@src/features/user/UserService";
import { TokenService } from "@src/shared/services/TokenService";
import { NotFoundError, UnauthorizedError } from "@src/shared/errors/errors";
import { EmailService } from "@src/shared/services/email/EmailService";

export class ConfirmationService {
  private userService: UserService;
  private tokenService: TokenService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.emailService = new EmailService();
  }

  async execute(request: ConfirmEmailRequest): Promise<ConfirmEmailResponse> {
    const payload = await this.tokenService.verifyToken(request.token);

    if (!payload) {
      throw new UnauthorizedError("Invalid or expired confirmation token");
    }

    const user = await this.userService.findById(payload.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.status !== "PENDING") {
      return {
        message: "Email already confirmed",
        email: user.email,
      };
    }

    await this.userService.updateStatus(user.id, "ACTIVE");

    await this.emailService.send({
      type: "WELCOME",
      to: user.email,
      data: {
        userName: user.name,
      },
    });

    return {
      message: "Email confirmed successfully",
      email: user.email,
    };
  }
}

// backend/src/features/credential/CredentialService.ts
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { CredentialRepository } from "@src/features/credential/CredentialRepository";
import {
  $credential,
  Credential,
  NewCredential,
  RequestCredentialReset,
  RequestCredentialResetResponse,
  ResetCredential,
  ResetCredentialResponse,
} from "@src/features/credential/credential-schemas";
import { ConflictError, NotFoundError, UnauthorizedError } from "@src/shared/errors/errors";
import { CryptoService } from "@src/shared/services/CryptoService";
import { TokenService } from "@src/shared/services/jwt/TokenService";
import { EmailService } from "@src/shared/services/email/EmailService";
import { UserService } from "@src/features/user/UserService";
import { User } from "@src/features/user/user-schemas";
import { env } from "@src/shared/config/env";

interface CredentialServiceDependencies {
  credentialRepository?: CredentialRepository;
  cryptoService?: CryptoService;
  tokenService?: TokenService;
  emailService?: EmailService;
  userService?: UserService;
}

export class CredentialService {
  private credentialRepository: CredentialRepository;
  private cryptoService: CryptoService;
  private tokenService: TokenService;
  private emailService: EmailService;
  private userService: UserService;

  constructor(dependencies?: CredentialServiceDependencies) {
    this.credentialRepository = dependencies?.credentialRepository ?? new CredentialRepository();
    this.cryptoService = dependencies?.cryptoService ?? new CryptoService();
    this.tokenService = dependencies?.tokenService ?? new TokenService();
    this.emailService = dependencies?.emailService ?? new EmailService();
    this.userService = dependencies?.userService ?? new UserService();
  }

  async create(newCredential: NewCredential): Promise<void> {
    const existing = await this.credentialRepository.getByUserId(newCredential.userId);

    if (existing) {
      throw new ConflictError("Credential already exists for this user");
    }

    const now = dayjs().toISOString();
    const id = randomUUID();
    const passwordHash = await this.cryptoService.hashPassword(newCredential.password);

    const credentialToSave: Credential = {
      id,
      version: 1,
      userId: newCredential.userId,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    const credential = $credential.parse(credentialToSave);

    await this.credentialRepository.save(credential);
  }

  async getByUserId(userId: User["id"]): Promise<Credential> {
    const credential = await this.credentialRepository.getByUserId(userId);

    if (!credential) {
      throw new NotFoundError("Credential not found for this user");
    }

    return credential;
  }

  async update(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const existing = await this.credentialRepository.getByUserId(userId);

    if (!existing) {
      throw new NotFoundError("Credential not found for this user");
    }

    const isOldPasswordValid = await this.cryptoService.comparePassword(
      oldPassword,
      existing.passwordHash
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedError("Old password is incorrect");
    }

    const newPasswordHash = await this.cryptoService.hashPassword(newPassword);

    await this.credentialRepository.patch(userId, {
      passwordHash: newPasswordHash,
    });
  }

  async requestCredentialReset(
    input: RequestCredentialReset
  ): Promise<RequestCredentialResetResponse> {
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

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

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

  async credentialReset(input: ResetCredential): Promise<ResetCredentialResponse> {
    const payload = await this.tokenService.verifyToken(input.token);

    if (!payload) {
      throw new UnauthorizedError("Invalid or expired reset token");
    }

    const user = await this.userService.findById(payload.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("User account is not active");
    }

    const passwordHash = await this.cryptoService.hashPassword(input.password);

    await this.credentialRepository.patch(user.id, { passwordHash });

    return {
      message: "Password reset successfully. You can now login with your new password.",
    };
  }
}

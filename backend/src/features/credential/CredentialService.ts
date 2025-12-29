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
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@src/shared/errors/errors";
import { CryptoService } from "@src/shared/services/CryptoService";
import { TokenService } from "@src/shared/services/jwt/TokenService";
import { EmailService } from "@src/shared/services/email/EmailService";
import { UserService } from "@src/features/user/UserService";
import { User } from "@src/features/user/user-schemas";

export class CredentialService {
  private credentialRepository: CredentialRepository;
  private cryptoService: CryptoService;
  private tokenService: TokenService;
  private emailService: EmailService;
  private userService: UserService;

  constructor() {
    this.credentialRepository = new CredentialRepository();
    this.cryptoService = new CryptoService();
    this.tokenService = new TokenService();
    this.emailService = new EmailService();
    this.userService = new UserService();
  }

  /**
   * Cria credencial para novo usuário
   */
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

  /**
   * Busca credencial por userId
   */
  async getByUserId(userId: User["id"]): Promise<Credential> {
    const credential = await this.credentialRepository.getByUserId(userId);

    if (!credential) {
      throw new NotFoundError("Credential not found for this user");
    }

    return credential;
  }

  /**
   * Atualiza senha (com validação da senha antiga)
   */
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

  /**
   * POST /api/credential
   * Solicita reset de senha (envia email com token)
   */
  async requestCredentialReset(
    input: RequestCredentialReset
  ): Promise<RequestCredentialResetResponse> {
    // 1. Busca usuário pelo email
    const user = await this.userService.findByEmail(input.email);

    // ⚠️ Por segurança, não informamos se o email existe ou não
    if (!user) {
      return {
        message: "If this email exists, a password reset link has been sent.",
        email: input.email,
      };
    }

    // 2. Valida se usuário está ativo
    if (user.status !== "ACTIVE") {
      return {
        message: "If this email exists, a password reset link has been sent.",
        email: input.email,
      };
    }

    // 3. Gera token de reset (expira em 1 hora)
    const resetToken = await this.tokenService.generatePasswordResetToken({
      userId: user.id,
      email: user.email,
    });

    // 4. Monta URL de reset
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // 5. Envia email
    await this.emailService.send({
      type: "PASSWORD_RESET",
      to: user.email,
      data: {
        userName: user.name,
        resetToken,
        resetUrl,
      },
    });

    // 6. Retorna sucesso
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

    // 3. Busca usuário
    const user = await this.userService.findById(payload.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // 4. Valida se usuário está ativo
    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("User account is not active");
    }

    // 5. Gera novo hash da senha
    const passwordHash = await this.cryptoService.hashPassword(input.password);

    // 6. Atualiza senha (sem validar senha antiga)
    await this.credentialRepository.patch(user.id, { passwordHash });

    // 7. Retorna sucesso
    return {
      message: "Password reset successfully. You can now login with your new password.",
    };
  }
}

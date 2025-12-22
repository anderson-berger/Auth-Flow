// backend/src/features/auth/register/RegisterService.ts
import { RegisterRequest, RegisterResponse } from "@src/features/auth/register/register-schemas";
import { $newCredential, NewCredential } from "@src/features/credential/credential-schemas";
import { CredentialService } from "@src/features/credential/CredentialService";
import { $newUser } from "@src/features/user/user-schemas";
import { UserService } from "@src/features/user/UserService";
import { ConflictError, ValidationError } from "@src/shared/errors/errors";
import { EmailService } from "@src/shared/services/email/EmailService";
import { TokenService } from "@src/shared/services/TokenService";

export class RegisterService {
  private userService: UserService;
  private credentialService: CredentialService;
  private tokenService: TokenService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.credentialService = new CredentialService();
    this.tokenService = new TokenService();
    this.emailService = new EmailService();
  }

  async execute(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    // 1. Valida se as senhas coincidem
    if (registerRequest.password !== registerRequest.confirmPassword) {
      throw new ValidationError("Passwords do not match");
    }

    // 2. Verifica se usuário já existe
    const existingUser = await this.userService.findByEmail(registerRequest.email);
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // 3. Cria usuário
    const newUser = $newUser.parse(registerRequest);
    const user = await this.userService.create(newUser);

    // 4. Cria credencial
    const newCredentialToSave: NewCredential = {
      userId: user.id,
      password: registerRequest.password,
    };
    const newCredential = $newCredential.parse(newCredentialToSave);
    await this.credentialService.create(newCredential);

    // 5. Gera token de confirmação
    const confirmationToken = await this.tokenService.generateEmailConfirmationToken({
      userId: user.id,
      email: user.email,
    });

    // 6. Monta URL de confirmação
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const confirmationUrl = `${frontendUrl}/confirm-email?token=${confirmationToken}`;

    // 7. Envia email de confirmação
    await this.emailService.send({
      type: "CONFIRMATION",
      to: user.email,
      data: {
        userName: user.name,
        confirmationToken,
        confirmationUrl,
      },
    });

    // 8. Retorna resposta
    const response: RegisterResponse = {
      message: "Registration successful. Please check your email to confirm your account.",
      email: user.email,
    };

    return response;
  }
}

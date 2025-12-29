import { RegisterRequest, RegisterResponse } from "@src/features/auth/register/register-schemas";
import { $newCredential, NewCredential } from "@src/features/credential/credential-schemas";
import { CredentialService } from "@src/features/credential/CredentialService";
import { $newUser } from "@src/features/user/user-schemas";
import { UserService } from "@src/features/user/UserService";
import { ConflictError } from "@src/shared/errors/errors";
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
    const existingUser = await this.userService.findByEmail(registerRequest.email);
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    //TODO: aqui estou com um problema de inconsistencia por que posso criar um user e falhar na credencial
    //daria para resolver usando o TRANSACTION no repository.
    const newUser = $newUser.parse(registerRequest);
    const user = await this.userService.create(newUser);

    const newCredentialToSave: NewCredential = {
      userId: user.id,
      password: registerRequest.password,
    };
    const newCredential = $newCredential.parse(newCredentialToSave);
    await this.credentialService.create(newCredential);

    const confirmationToken = await this.tokenService.generateEmailConfirmationToken({
      userId: user.id,
      email: user.email,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const confirmationUrl = `${frontendUrl}/confirm-email?token=${confirmationToken}`;

    await this.emailService.send({
      type: "CONFIRMATION",
      to: user.email,
      data: {
        userName: user.name,
        confirmationToken,
        confirmationUrl,
      },
    });

    const response: RegisterResponse = {
      message: "Registration successful. Please check your email to confirm your account.",
      email: user.email,
    };

    return response;
  }
}

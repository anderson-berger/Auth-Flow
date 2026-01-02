import { RegisterRequest, RegisterResponse } from "@src/features/auth/register/register-schemas";
import { Credential } from "@src/features/credential/credential-schemas";
import { $newUser, User } from "@src/features/user/user-schemas";
import { UserService } from "@src/features/user/UserService";
import { ConflictError } from "@src/shared/errors/errors";
import { EmailService } from "@src/shared/services/email/EmailService";
import { EmailProviderSES } from "@src/shared/services/email/EmailProvider";
import { TokenService } from "@src/shared/services/jwt/TokenService";
import { CryptoService } from "@src/shared/services/CryptoService";
import { RegisterRepository } from "@src/features/auth/register/RegisterRepository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { env } from "@src/shared/config/env";

interface RegisterServiceDependencies {
  userService?: UserService;
  registerRepository?: RegisterRepository;
  tokenService?: TokenService;
  emailService?: EmailService;
  cryptoService?: CryptoService;
}

export class RegisterService {
  private userService: UserService;
  private registerRepository: RegisterRepository;
  private tokenService: TokenService;
  private emailService: EmailService;
  private cryptoService: CryptoService;

  constructor(dependencies?: RegisterServiceDependencies) {
    this.userService = dependencies?.userService ?? new UserService();
    this.registerRepository = dependencies?.registerRepository ?? new RegisterRepository();
    this.tokenService = dependencies?.tokenService ?? new TokenService();
    this.emailService = dependencies?.emailService ?? new EmailService(new EmailProviderSES());
    this.cryptoService = dependencies?.cryptoService ?? new CryptoService();
  }

  async execute(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const existingUser = await this.userService.findByEmail(registerRequest.email);
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const now = dayjs().toISOString();
    const userId = randomUUID();
    const newUser = $newUser.parse(registerRequest);

    const user: User = {
      id: userId,
      version: 1,
      name: newUser.name,
      email: newUser.email,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    const credentialId = randomUUID();
    const passwordHash = await this.cryptoService.hashPassword(registerRequest.password);

    const credential: Credential = {
      id: credentialId,
      version: 1,
      userId: user.id,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    await this.registerRepository.createUserWithCredential(user, credential);

    const confirmationToken = await this.tokenService.generateEmailConfirmationToken({
      userId: user.id,
      email: user.email,
    });

    const confirmationUrl = `${env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;

    if (env.STAGE.toLocaleLowerCase() === "local") {
    } else {
      await this.emailService.send({
        type: "CONFIRMATION",
        to: user.email,
        data: {
          userName: user.name,
          confirmationToken,
          confirmationUrl,
        },
      });
    }

    const response: RegisterResponse = {
      message: "Registration successful. Please check your email to confirm your account.",
      email: user.email,
    };

    return response;
  }
}

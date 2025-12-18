import { RegisterRequest, RegisterResponse } from "@src/features/auth/register/register-schemas";
import { $newCredential, NewCredential } from "@src/features/credential/credential-schemas";
import { CredentialService } from "@src/features/credential/CredentialService";
import { $newUser, NewUser } from "@src/features/user/user-schemas";
import { UserService } from "@src/features/user/UserService";
import { ConflictError } from "@src/shared/errors/errors";

export class RegisterService {
  private userService: UserService;
  private credentialService: CredentialService;

  constructor() {
    this.userService = new UserService();
    this.credentialService = new CredentialService();
  }

  async execute(registerRequest: RegisterRequest) {
    if (registerRequest.password !== registerRequest.confirmPassword) {
      throw new ConflictError("User already exists");
    }

    const exist = await this.userService.findByEmail(registerRequest.email);
    if (exist) {
      throw new ConflictError("User already exists");
    }
    //USER

    const newUser = $newUser.parse(registerRequest);

    const user = await this.userService.create(newUser);
    //Credential
    const newCredentialToSave: NewCredential = {
      userId: user.id,
      password: registerRequest.password,
    };
    const newCredential = $newCredential.parse(newCredentialToSave);

    await this.credentialService.create(newCredential);

    const response: RegisterResponse = {
      message: "Registration successful. Please check your email to confirm your account.",
      email: user.email,
    };

    return response;
  }
}

import { $user, NewUser, User } from "@src/features/user/user-schemas";
import { UserRepository } from "@src/features/user/UserRepository";
import { ConflictError } from "@src/shared/errors/errors";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async create(newUser: NewUser): Promise<User> {
    const existing = await this.userRepository.getByEmail(newUser.email);

    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const now = dayjs().toISOString();
    const id = randomUUID();

    const userToSave: User = {
      id,
      version: 1,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
      ...newUser,
    };

    const user = $user.parse(userToSave);

    await this.userRepository.save(user);

    return user;
  }

  async findByEmail(email: User["email"]): Promise<User | null> {
    const user = this.userRepository.getByEmail(email);

    return user;
  }
}

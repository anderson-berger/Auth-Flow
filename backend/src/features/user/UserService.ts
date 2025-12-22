// backend/src/features/user/UserService.ts
import { $user, NewUser, User } from "@src/features/user/user-schemas";
import { UserRepository } from "@src/features/user/UserRepository";
import { ConflictError, NotFoundError } from "@src/shared/errors/errors";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Cria novo usuário
   */
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

  /**
   * Busca usuário por email
   */
  async findByEmail(email: User["email"]): Promise<User | null> {
    const user = await this.userRepository.getByEmail(email);
    return user;
  }

  /**
   * Busca usuário por ID
   */
  async findById(id: User["id"]): Promise<User | null> {
    const user = await this.userRepository.getById(id);
    return user;
  }

  /**
   * Atualiza status do usuário
   */
  async updateStatus(userId: User["id"], status: User["status"]): Promise<void> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.status === status) {
      return;
    }

    const now = dayjs().toISOString();

    await this.userRepository.patch(userId, {
      status,
      updatedAt: now,
    });
  }
}

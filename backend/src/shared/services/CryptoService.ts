import bcrypt from "bcryptjs";
import { env } from "@src/shared/config/env";

export class CryptoService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = env.BCRYPT_ROUNDS;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

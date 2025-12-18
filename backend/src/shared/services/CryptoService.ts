import bcrypt from "bcryptjs";

/**
 * Crypto Service
 *
 * Handles password hashing and verification using bcrypt
 */
export class CryptoService {
  private readonly saltRounds: number;

  constructor() {
    // Get from environment (default: 10 rounds)
    this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
  }

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

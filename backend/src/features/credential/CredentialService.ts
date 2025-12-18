import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { CredentialRepository } from "@src/features/credential/CredentialRepository";
import {
  $credential,
  Credential,
  NewCredential,
} from "@src/features/credential/credential-schemas";
import { ConflictError, NotFoundError } from "@src/shared/errors/errors";
import { CryptoService } from "@src/shared/services/CryptoService";
import { User } from "@src/features/user/user-schemas";

export class CredentialService {
  private credentialRepository: CredentialRepository;
  private cryptoService: CryptoService;
  constructor() {
    this.credentialRepository = new CredentialRepository();
    this.cryptoService = new CryptoService();
  }

  async create(newCredential: NewCredential) {
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

  async getByUserId(userId: User["id"]) {
    const credential = await this.credentialRepository.getByUserId(userId);

    if (!credential) {
      throw new NotFoundError("Credential not found for this user");
    }

    return credential;
  }
}

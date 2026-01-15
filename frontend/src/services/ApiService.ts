import api from './api';

import type { RegisterRequest } from '@backend/features/auth/register/register-schemas';
import type { LoginRequest, LoginResponse } from '@backend/features/auth/login/login-schemas';
import type { RefreshTokenResponse } from '@backend/features/auth/refresh/refresh-schemas';
import type {
  RequestCredentialReset,
  ResetCredential,
} from '@backend/features/credential/credential-schemas';

import AuthService from 'src/services/AuthService';

class ApiService {
  /**
   * Registra um novo usuário
   */
  async register(data: RegisterRequest): Promise<void> {
    await api.post('/auth/register', data);
  }

  /**
   * Confirma o email do usuário
   */
  async confirmEmail(token: string): Promise<void> {
    await api.get(`/auth/confirm-email?token=${token}`);
  }

  /**
   * Faz login do usuário
   */
  async login(loginRequest: LoginRequest): Promise<void> {
    const { data } = await api.post<LoginResponse>('/auth/login', loginRequest);
    const { accessToken, refreshToken } = data;

    AuthService.setTokens(accessToken, refreshToken);
  }

  /**
   * Refresh do access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });

    return response.data;
  }

  /**
   * Solicita reset de senha
   */
  async requestPasswordReset(data: RequestCredentialReset): Promise<void> {
    await api.post('/credential', data);
  }

  /**
   * Reseta a senha com o token
   */
  async resetPassword(data: ResetCredential): Promise<void> {
    await api.put('/credential', data);
  }

  /**
   * Exemplo de chamada protegida (dashboard)
   */
  async getDashboardData(): Promise<unknown> {
    const response = await api.get('/dashboard');
    return response.data;
  }

  async healthCheck() {
    const { data } = await api.get('/health');
    console.log('data', data);
  }
}

export default new ApiService();

interface UserData {
  userId: string;
  email: string;
  name: string;
  status: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_DATA_KEY = 'user_data';

  /**
   * Salva os tokens no localStorage
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Retorna o access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Retorna o refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Salva dados do usuário
   */
  setUserData(userData: UserData): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  /**
   * Retorna dados do usuário
   */
  getUserData(): UserData | null {
    const data = localStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Remove todos os dados de autenticação
   */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }
}

export default new AuthService();

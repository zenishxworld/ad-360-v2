import { AuthRepository } from '../repositories/AuthRepository';

export class AuthService {
  private repository = new AuthRepository();

  async signInWithGoogle() {
    return this.repository.signInWithGoogle();
  }

  async signOut() {
    return this.repository.signOut();
  }

  async getSession() {
    return this.repository.getSession();
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.repository.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();

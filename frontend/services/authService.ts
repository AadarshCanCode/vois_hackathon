import type { User } from '@types';
import { post } from '@lib/apiClient';

const STORAGE_KEY = 'cyberSecUser';

type LoginPayload = {
  email: string;
  password: string;
  role: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
  role: string;
  bio?: string;
  specialization?: string;
};

class AuthService {
  async login(credentials: LoginPayload): Promise<User> {
    const user = await post<User>('/auth/login', credentials);
    this.persistUser(user);
    return user;
  }

  async register(payload: RegisterPayload): Promise<User> {
    const user = await post<User>('/auth/register', payload);
    this.persistUser(user);
    return user;
  }

  async logout(): Promise<void> {
    await post('/auth/logout');
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): (User & { role?: string }) | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User & { role?: string };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }

  isTeacher(): boolean {
    return this.getCurrentUser()?.role === 'teacher';
  }

  isStudent(): boolean {
    return this.getCurrentUser()?.role === 'student';
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }

  private persistUser(user: User) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();

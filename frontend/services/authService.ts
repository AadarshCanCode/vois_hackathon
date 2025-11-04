import { apiClient, ApiResponse } from './apiClient';
import { User, LoginCredentials, RegisterData } from '@types';

export interface AuthResponse {
  user: User;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    
    // Clear local storage
    localStorage.removeItem('cyberSecUser');
    
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<{ user: User }>('/auth/me');
  }

  async hasRole(role: string): Promise<ApiResponse<{ hasRole: boolean }>> {
    return apiClient.get<{ hasRole: boolean }>(`/auth/check-role/${role}`);
  }

  async isAdmin(): Promise<ApiResponse<{ hasRole: boolean }>> {
    return this.hasRole('admin');
  }

  async isTeacher(): Promise<ApiResponse<{ hasRole: boolean }>> {
    return this.hasRole('teacher');
  }

  async isStudent(): Promise<ApiResponse<{ hasRole: boolean }>> {
    return this.hasRole('student');
  }

  // Local storage helpers for backward compatibility
  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('cyberSecUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  saveUserToStorage(user: User): void {
    localStorage.setItem('cyberSecUser', JSON.stringify(user));
  }

  clearUserFromStorage(): void {
    localStorage.removeItem('cyberSecUser');
  }
}

export const authService = new AuthService();
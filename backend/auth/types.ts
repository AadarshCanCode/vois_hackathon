export interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  level?: string;
  completed_assessment?: boolean;
  bio?: string;
  specialization?: string;
  experience_years?: string;
  [key: string]: unknown;
}

export interface DBUser extends User {
  password_hash?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role: string;
  bio?: string;
  specialization?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
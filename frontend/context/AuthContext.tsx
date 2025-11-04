import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@services/authService';
import type { User } from '@types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role: string,
    bio?: string,
    specialization?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check local storage for immediate UI
        const storedUser = authService.getCurrentUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }

        // Then verify with backend
        const response = await authService.getCurrentUser();
        if (response.data && response.data.user) {
          setUser(response.data.user);
          authService.saveUserToStorage(response.data.user);
        } else if (storedUser) {
          // Backend says no user, clear local storage
          authService.clearUserFromStorage();
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On error, clear everything
        authService.clearUserFromStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role: string = 'student'): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password, role });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        authService.saveUserToStorage(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string,
    bio?: string,
    specialization?: string
  ): Promise<boolean> => {
    try {
      const response = await authService.register({ 
        email, 
        password, 
        name, 
        role, 
        bio, 
        specialization 
      });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        authService.saveUserToStorage(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      authService.clearUserFromStorage();
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data && response.data.user) {
        setUser(response.data.user);
        authService.saveUserToStorage(response.data.user);
      } else {
        setUser(null);
        authService.clearUserFromStorage();
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
      authService.clearUserFromStorage();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
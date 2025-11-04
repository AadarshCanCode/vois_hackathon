import bcrypt from 'bcryptjs';
import { supabase, testSupabaseConnection, sanitizeUser } from './supabase.js';
import { User, LoginCredentials, RegisterData, DBUser } from './types.js';

class AuthService {
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      // Proactively test connectivity for clearer errors (helps diagnose CORS/env issues)
      await testSupabaseConnection();
      
      // Primary auth: use Supabase Auth (creates client session so RLS works)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (signInError) {
        // If supabase auth fails, fall back to legacy DB check (maintains compatibility)
        console.warn('Supabase auth failed, attempting legacy DB fallback:', signInError.message);

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .eq('role', credentials.role)
          .maybeSingle();

        if (error) {
          console.error('Login error:', error);
          throw new Error(`Database error during login: ${error.message}`);
        }

        if (!user) throw new Error(`No ${credentials.role} account found with email: ${credentials.email}`);

        const isValidPassword = await bcrypt.compare(credentials.password, (user as DBUser).password_hash ?? '');
        if (!isValidPassword) throw new Error('Incorrect password. Please try again.');

        return sanitizeUser(user as DBUser);
      }

      // Fetch profile row for signed-in user
      const sessionUser = signInData.user;
      if (!sessionUser) throw new Error('Signed in but no user returned from Supabase Auth');

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', sessionUser.email)
        .maybeSingle();

      if (profileError) {
        console.warn('Failed to fetch profile row after sign-in:', profileError.message);
      }

      const profileRow = profile ? (profile as DBUser) : undefined;
      if (profileRow) {
        return sanitizeUser(profileRow);
      } else {
        return { id: sessionUser.id, email: sessionUser.email, name: sessionUser.user_metadata?.full_name } as User;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<User | null> {
    try {
      // Create account with Supabase Auth first (creates session client-side)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: { data: { full_name: userData.name } }
      });

      if (signUpError) {
        console.error('Supabase signUp error:', signUpError);
        throw signUpError;
      }

      const authUser = signUpData.user;
      // Insert profile row into users table if not exists
      const profileRow = {
        id: authUser?.id ?? undefined,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        level: 'beginner',
        completed_assessment: userData.role === 'admin',
        bio: userData.bio || '',
        specialization: userData.specialization || '',
        experience_years: userData.role === 'student' ? null : '0-1'
      } as Record<string, unknown>;

      const { data: newUser, error } = await supabase
        .from('users')
        .upsert([profileRow])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Registration error while creating profile:', error);
        throw error;
      }

      return (newUser || profileRow) as unknown as User;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    return profile ? sanitizeUser(profile as DBUser) : {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name
    } as User;
  }

  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  async isTeacher(): Promise<boolean> {
    return this.hasRole('teacher');
  }

  async isStudent(): Promise<boolean> {
    return this.hasRole('student');
  }
}

export const authService = new AuthService();
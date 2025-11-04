import bcrypt from 'bcryptjs';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase-client';

interface LoginInput {
  email: string;
  password: string;
  role?: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  role: string;
  bio?: string;
  specialization?: string;
}

interface DbUser {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
  password_hash?: string | null;
  [key: string]: unknown;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return supabase;
}

function sanitizeUser(user: DbUser) {
  const copy: Record<string, unknown> = { ...user };
  delete copy.password_hash;
  return copy;
}

function handlePostgrestError(prefix: string, error: PostgrestError | null) {
  if (error) {
    throw new Error(`${prefix}: ${error.message}`);
  }
}

export const authService = {
  async login({ email, password, role }: LoginInput) {
    const client = requireSupabase();

    // Attempt Supabase Auth sign in first
    const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (!signInError && signInData.user) {
      const { data: profile, error: profileError } = await client
        .from('users')
        .select('*')
        .eq('email', signInData.user.email)
        .maybeSingle();
      if (profileError) {
        console.warn('Profile fetch after login failed:', profileError.message);
      }
      const sanitized = profile ? sanitizeUser(profile as DbUser) : {
        id: signInData.user.id,
        email: signInData.user.email,
        name: signInData.user.user_metadata?.full_name ?? null,
        role: signInData.user.user_metadata?.role ?? null
      };
      return sanitized;
    }

    console.warn('Supabase auth failed, attempting legacy DB fallback:', signInError?.message);

    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('role', role)
      .maybeSingle();
    handlePostgrestError('Database error during login', error);

    if (!user) {
      throw new Error(`No ${(role ?? 'user')} account found with email: ${email}`);
    }

    const dbUser = user as DbUser;
    const hashed = dbUser.password_hash ?? '';
    const valid = hashed ? await bcrypt.compare(password, hashed) : false;
    if (!valid) {
      throw new Error('Incorrect password. Please try again.');
    }

    return sanitizeUser(dbUser);
  },

  async register(userData: RegisterInput) {
    const client = requireSupabase();

    const { data: createdUser, error: createError } = await client.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.name,
        role: userData.role
      }
    });
    if (createError) {
      throw new Error(`Supabase admin create user failed: ${createError.message}`);
    }

    const profileRow: Record<string, unknown> = {
      id: createdUser.user?.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      level: 'beginner',
      completed_assessment: userData.role === 'admin',
      bio: userData.bio ?? '',
      specialization: userData.specialization ?? '',
      experience_years: userData.role === 'student' ? null : '0-1'
    };

    const { data: profile, error: profileError } = await client
      .from('users')
      .upsert([profileRow])
      .select()
      .maybeSingle();
    handlePostgrestError('Registration error while creating profile', profileError);

    return profile ? sanitizeUser(profile as DbUser) : sanitizeUser(profileRow as DbUser);
  }
};

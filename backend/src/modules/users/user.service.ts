import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase-client';

export type AllowedUserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfileUpdate {
  name?: string | null;
  bio?: string | null;
  specialization?: string | null;
  level?: AllowedUserLevel;
  completed_assessment?: boolean;
  certificates?: string[];
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return supabase;
}

function handleError(prefix: string, error: PostgrestError | null) {
  if (error) {
    throw new Error(`${prefix}: ${error.message}`);
  }
}

function sanitizeUpdates(updates: UserProfileUpdate): Record<string, unknown> {
  const allowedKeys: (keyof UserProfileUpdate)[] = ['name', 'bio', 'specialization', 'level', 'completed_assessment', 'certificates'];
  const sanitized: Record<string, unknown> = {};

  for (const key of allowedKeys) {
    if (updates[key] !== undefined) {
      sanitized[key] = updates[key];
    }
  }

  if (sanitized.level && !['beginner', 'intermediate', 'advanced'].includes(String(sanitized.level))) {
    throw new Error('Invalid level provided');
  }

  if ('certificates' in sanitized) {
    if (!Array.isArray(sanitized.certificates)) {
      throw new Error('certificates must be an array');
    }
  }

  return sanitized;
}

export const userService = {
  async updateUser(userId: string, updates: UserProfileUpdate) {
    const sanitized = sanitizeUpdates(updates);
    if (Object.keys(sanitized).length === 0) {
      throw new Error('No valid fields provided for update');
    }

    const client = requireSupabase();
    const { data, error } = await client
      .from('users')
      .update(sanitized)
      .eq('id', userId)
      .select()
      .maybeSingle();
    handleError('Failed to update user profile', error);
    return data;
  },

  async appendCertificate(userId: string, url: string) {
    if (!url) {
      throw new Error('Certificate URL is required');
    }

    const client = requireSupabase();
    const { data: existing, error: fetchError } = await client
      .from('users')
      .select('certificates')
      .eq('id', userId)
      .maybeSingle();
    handleError('Failed to fetch existing certificates', fetchError);

    const currentCertificates = Array.isArray(existing?.certificates) ? existing?.certificates as string[] : [];
    const certificates = [...currentCertificates, url];

    const { data, error } = await client
      .from('users')
      .update({ certificates })
      .eq('id', userId)
      .select()
      .maybeSingle();
    handleError('Failed to append certificate', error);

    return data;
  }
};

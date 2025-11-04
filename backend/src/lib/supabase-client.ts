import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
  console.warn('[SUPABASE] Supabase environment variables are not fully configured. Some API routes may not function.');
}

export const supabase = env.supabaseUrl && env.supabaseServiceRoleKey
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export async function assertSupabaseConnection() {
  if (!supabase) {
    throw new Error('Supabase client is not configured');
  }

  const { error } = await supabase.from('users').select('id').limit(1);
  if (error) {
    throw new Error(`Supabase connectivity test failed: ${error.message}`);
  }
}

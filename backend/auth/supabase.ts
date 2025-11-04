import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DBUser, User } from './types.js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export async function testSupabaseConnection(): Promise<void> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`Database connection error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function sanitizeUser(dbUser: DBUser): User {
  const copy: Record<string, unknown> = { ...dbUser };
  // remove password_hash if present
  if ('password_hash' in copy) {
    // remove password_hash property in a type-safe way
    delete copy['password_hash'];
  }
  return copy as unknown as User;
}
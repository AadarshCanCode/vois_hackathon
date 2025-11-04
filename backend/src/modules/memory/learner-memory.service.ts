import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase-client';

export interface MemoryFact {
  kind: 'strength' | 'gap' | 'preference' | 'note';
  topic?: string;
  text: string;
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

export const learnerMemoryService = {
  async upsertFacts(userId: string, facts: MemoryFact[]) {
    const client = requireSupabase();
    const rows = facts.map(f => ({
      admin_id: userId,
      content: `[${f.kind}] ${f.topic ? `${f.topic}: ` : ''}${f.text}`
    }));
    const { error } = await client.from('notes').insert(rows);
    handleError('Failed to store learner memory facts', error);
    return true;
  },

  async getContext(userId: string, limit = 10) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('notes')
      .select('content, created_at')
      .eq('admin_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    handleError('Failed to load learner memory context', error);
    return (data ?? []).map(entry => entry.content ?? '').join('\n');
  }
};

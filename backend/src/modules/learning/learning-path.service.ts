import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase-client';

export interface AnalysisTopicScore {
  topic: string;
  accuracy: number;
  confidenceAvg: number;
}

export interface AnalysisSummary {
  strengths: AnalysisTopicScore[];
  gaps: AnalysisTopicScore[];
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

export const learningPathService = {
  async allocateInitialPath(userId: string, courseId: string, analysis: AnalysisSummary) {
    const client = requireSupabase();
    const gapTopics = new Set(analysis.gaps.map(g => g.topic));

    const { data: modules, error } = await client
      .from('course_modules')
      .select('id, title, module_order')
      .eq('course_id', courseId)
      .order('module_order', { ascending: true });
    handleError('Failed to fetch modules', error);

    const prioritized = (modules ?? []).map(m => ({
      ...m,
      priority: gapTopics.size
        ? (gapTopics.has((m.title.split(' ')[0] || 'general').toLowerCase()) ? 0 : 1)
        : 1
    }))
      .sort((a, b) => a.priority - b.priority || a.module_order - b.module_order);

    const upserts = prioritized.map(m => ({
      user_id: userId,
      course_id: courseId,
      module_id: m.id,
      completed: false,
      quiz_score: 0,
      topic: (m.title.split(' ')[0] || 'general').toLowerCase(),
      source: 'adaptive'
    }));

    if (upserts.length) {
      const { error: upsertError } = await client
        .from('user_progress')
        .upsert(upserts);
      handleError('Failed to allocate path', upsertError);
    }

    return upserts.map(u => u.module_id);
  },

  async rebalance(userId: string, courseId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('user_progress')
      .select('module_id, completed')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .order('updated_at', { ascending: false });
    handleError('Failed to read progress', error);
    return data ?? [];
  }
};

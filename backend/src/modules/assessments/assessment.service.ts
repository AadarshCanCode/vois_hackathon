import crypto from 'node:crypto';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase-client';

export type AssessmentContext = 'initial' | 'in_content' | 'final_exam';

export interface AssessmentAttempt {
  id: string;
  user_id: string;
  context: AssessmentContext;
}

export interface AssessmentAnswerInput {
  attempt_id?: string;
  user_id: string;
  question_id: string;
  selected_answer: number;
  confidence_level: number;
  is_correct: boolean;
  context?: AssessmentContext;
  time_taken_seconds?: number;
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

export const assessmentService = {
  async startAttempt(userId: string, context: AssessmentContext = 'initial'): Promise<AssessmentAttempt> {
    const client = requireSupabase();
    const attemptId = crypto.randomUUID();

    try {
      const { error } = await client
        .from('assessment_responses')
        .insert([
          {
            attempt_id: attemptId,
            user_id: userId,
            question_id: 'INIT',
            selected_answer: 0,
            confidence_level: 3,
            is_correct: true,
            context
          }
        ]);
      handleError('Failed to bootstrap assessment attempt', error);

      await client
        .from('assessment_responses')
        .delete()
        .eq('attempt_id', attemptId)
        .eq('question_id', 'INIT');
    } catch (error) {
      console.warn('Assessment attempt bootstrap failed, falling back to client-only attempt:', (error as Error).message);
    }

    return { id: attemptId, user_id: userId, context };
  },

  async submitAnswer(answer: AssessmentAnswerInput) {
    const client = requireSupabase();
    const payload = {
      attempt_id: answer.attempt_id ?? crypto.randomUUID(),
      user_id: answer.user_id,
      question_id: answer.question_id,
      selected_answer: answer.selected_answer,
      confidence_level: answer.confidence_level,
      is_correct: answer.is_correct,
      context: answer.context ?? 'initial',
      time_taken_seconds: answer.time_taken_seconds ?? null
    };

    const { error } = await client
      .from('assessment_responses')
      .insert([payload]);
    handleError('Failed to submit answer', error);
    return true;
  },

  async getAttemptResults(attemptId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('assessment_responses')
      .select('question_id, is_correct, confidence_level, context')
      .eq('attempt_id', attemptId);
    handleError('Failed to fetch results', error);
    return data ?? [];
  }
};

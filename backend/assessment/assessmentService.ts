import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AssessmentAttempt, AssessmentAnswerInput, AssessmentResult } from './types.js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

class AssessmentService {
  async startAttempt(userId: string, context: AssessmentAttempt['context'] = 'initial'): Promise<AssessmentAttempt> {
    const attemptId = crypto.randomUUID();
    try {
      const { error } = await supabase.from('assessment_responses').insert([{
        attempt_id: attemptId,
        user_id: userId,
        question_id: 'INIT',
        selected_answer: 0,
        confidence_level: 3,
        is_correct: true,
        context
      }]);
      
      if (error) throw error;
      
      await supabase.from('assessment_responses').delete().eq('attempt_id', attemptId).eq('question_id', 'INIT');
      
      return { id: attemptId, user_id: userId, context } as AssessmentAttempt;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Assessment attempt bootstrap failed, falling back to client-only attempt:', msg);
      return { id: attemptId, user_id: userId, context } as AssessmentAttempt;
    }
  }

  async submitAnswer(answer: AssessmentAnswerInput): Promise<boolean> {
    const payload = {
      attempt_id: answer.attempt_id ?? crypto.randomUUID(),
      user_id: answer.user_id,
      question_id: answer.question_id,
      selected_answer: answer.selected_answer,
      confidence_level: answer.confidence_level,
      is_correct: answer.is_correct,
      context: answer.context ?? 'initial'
    };
    
    const { error } = await supabase.from('assessment_responses').insert([payload]);
    if (error) throw new Error(`Failed to submit answer: ${error.message}`);
    return true;
  }

  async getAttemptResults(attemptId: string): Promise<AssessmentResult[]> {
    const { data, error } = await supabase
      .from('assessment_responses')
      .select('question_id, is_correct, confidence_level, context')
      .eq('attempt_id', attemptId);
      
    if (error) throw new Error(`Failed to fetch results: ${error.message}`);
    return data ?? [];
  }

  async getUserAssessments(userId: string): Promise<AssessmentAttempt[]> {
    const { data, error } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(`Failed to fetch user assessments: ${error.message}`);
    return data ?? [];
  }

  async calculateScore(attemptId: string): Promise<{ score: number; total: number; percentage: number }> {
    const results = await this.getAttemptResults(attemptId);
    const total = results.length;
    const score = results.filter(r => r.is_correct).length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    
    return { score, total, percentage };
  }
}

export const assessmentService = new AssessmentService();
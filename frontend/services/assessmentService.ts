import { get, post } from '@lib/apiClient';

export interface AssessmentAttempt {
  id: string;
  user_id: string;
  context: 'initial' | 'in_content' | 'final_exam';
  created_at?: string;
}

export interface AssessmentAnswerInput {
  attempt_id?: string;
  user_id: string;
  question_id: string;
  selected_answer: number;
  confidence_level: number;
  is_correct: boolean;
  context?: AssessmentAttempt['context'];
  time_taken_seconds?: number;
}

class AssessmentService {
  async startAttempt(userId: string, context: AssessmentAttempt['context'] = 'initial') {
    return post<AssessmentAttempt>('/assessments/attempts', { userId, context });
  }

  async submitAnswer(answer: AssessmentAnswerInput) {
    await post('/assessments/answers', answer);
    return true;
  }

  async getAttemptResults(attemptId: string) {
    return get(`/assessments/attempts/${attemptId}/results`);
  }
}

export const assessmentService = new AssessmentService();

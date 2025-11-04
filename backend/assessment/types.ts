export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

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
  confidence_level: number; // 1..5
  is_correct: boolean;
  context?: AssessmentAttempt['context'];
}

export interface AssessmentResult {
  question_id: string;
  is_correct: boolean;
  confidence_level: number;
  context: AssessmentAttempt['context'];
}
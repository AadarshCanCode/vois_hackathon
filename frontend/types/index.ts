export interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  level?: string;
  completed_assessment?: boolean;
  bio?: string;
  specialization?: string;
  experience_years?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role: string;
  bio?: string;
  specialization?: string;
}

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

export interface Module {
  id: string;
  title: string;
  description: string;
  content: string;
  course_id: string;
  module_order: number;
  is_published: boolean;
  videoUrl?: string;
  labUrl?: string;
  completed?: boolean;
  testScore?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  // DB may return modules under `course_modules` when using supabase relation selects
  modules?: Module[];
  course_modules?: Module[];

  // Additional DB fields
  teacher_id?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_published?: boolean;
  enrollment_count?: number;
  rating?: number;
  estimated_hours?: number;
  created_at?: string | Date;

  // UI helpers
  unlocked?: boolean;
  progress?: number;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tools: string[];
  liveUrl?: string;
  instructions: string;
  objectives?: string[];
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

// Technical question types
export interface TechnicalQuestion {
  id: string;
  company: string;
  position: string;
  difficulty: 'junior' | 'mid' | 'senior' | 'principal';
  category: string;
  question: string;
  hints: string[];
  solution: string;
  explanation: string;
  followUpQuestions?: string[];
  tags: string[];
  timeLimit: number; // in minutes
}

export * from "./types";
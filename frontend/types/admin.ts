import type { Course } from './index';

export type Role = 'student' | 'teacher' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role?: Role;
  level?: 'beginner' | 'intermediate' | 'advanced';
  created_at?: string | Date;
  completed_assessment?: boolean;
  certificates?: string[];
}

export interface AdminCourseSummary extends Course {
  is_published: boolean;
  enrollment_count?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  teacher?: { id?: string; name?: string | null } | null;
}

export interface AdminNote {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  course_id: string;
  created_at: string;
}

export interface AdminDashboardStats {
  users: { teachers: number; students: number; total: number };
  courses: { total: number; published: number; draft: number };
  enrollments: { total: number; thisMonth: number };
}

export interface AssessmentResponse {
  id: string;
  attempt_id?: string | null;
  user_id?: string | null;
  question_id: string;
  selected_answer?: number | null;
  confidence_level: number;
  is_correct: boolean;
  time_taken_seconds?: number | null;
  context?: string | null;
  created_at?: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
    level?: string | null;
  } | null;
}

import { apiClient, ApiResponse } from './apiClient';

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_published?: boolean;
  enrollment_count?: number;
  rating?: number;
  estimated_hours?: number;
  teacher_id?: string;
  category?: string;
  created_at?: string;
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
}

export interface CourseResponse {
  courses: Course[];
}

export interface CourseDetailResponse {
  course: Course & { modules?: Module[] };
}

export class CourseService {
  async getCourses(params?: {
    difficulty?: string;
    category?: string;
    teacher_id?: string;
  }): Promise<ApiResponse<CourseResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.teacher_id) searchParams.append('teacher_id', params.teacher_id);
    
    const query = searchParams.toString();
    const endpoint = `/courses${query ? `?${query}` : ''}`;
    
    return apiClient.get<CourseResponse>(endpoint);
  }

  async getCourse(id: string): Promise<ApiResponse<CourseDetailResponse>> {
    return apiClient.get<CourseDetailResponse>(`/courses/${id}`);
  }

  async enroll(courseId: string, userId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(`/courses/${courseId}/enroll`, {
      userId
    });
  }

  async getEnrolledCourses(userId: string): Promise<ApiResponse<CourseResponse>> {
    return apiClient.get<CourseResponse>(`/users/${userId}/courses`);
  }

  async updateProgress(courseId: string, userId: string, moduleId: string, progress: number): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(`/courses/${courseId}/progress`, {
      userId,
      moduleId,
      progress
    });
  }
}

export const courseService = new CourseService();
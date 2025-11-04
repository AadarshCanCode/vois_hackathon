import { API_BASE_URL, del, get, patch, post } from '@lib/apiClient';
import type { AdminCourseSummary, AdminDashboardStats, AdminNote, AdminUser, AssessmentResponse, Role } from '@types/admin';

class AdminService {
  async getAllUsers() {
    return get<AdminUser[]>('/admin/management/users');
  }

  async getUsersByRole(role: Role) {
    return get<AdminUser[]>(`/admin/management/users/role/${role}`);
  }

  async updateUserRole(userId: string, role: Role) {
    return patch<AdminUser | null>(`/admin/management/users/${userId}/role`, { role });
  }

  async deleteUser(userId: string) {
    await del(`/admin/management/users/${userId}`);
    return true;
  }

  async getAllCourses() {
    return get<AdminCourseSummary[]>('/admin/management/courses');
  }

  async getAllNotes() {
    return get<AdminNote[]>('/admin/management/notes');
  }

  async createNote(noteData: Record<string, unknown>) {
    return post<AdminNote | null>('/admin/management/notes', noteData);
  }

  async uploadFile(file: File, folder = 'uploads') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${API_BASE_URL}/admin/management/notes/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json() as { url: string };
    return data.url;
  }

  async updateCourseStatus(courseId: string, isPublished: boolean) {
    return patch<AdminCourseSummary | null>(`/admin/management/courses/${courseId}/status`, { isPublished });
  }

  async getDashboardStats() {
    return get<AdminDashboardStats>('/admin/management/dashboard/stats');
  }

  async getUserProgress(userId: string) {
    return get<unknown[]>(`/admin/management/users/${userId}/progress`);
  }

  async getTeacherAnalytics(teacherId: string) {
    return get<Record<string, unknown>>(`/admin/management/teachers/${teacherId}/analytics`);
  }

  async getAssessmentResponses() {
    return get<AssessmentResponse[]>('/admin/management/assessments/responses');
  }
}

export const adminService = new AdminService();

import { API_BASE_URL, del, get, patch, post } from '@lib/apiClient';

type Role = 'student' | 'teacher' | 'admin';

class AdminService {
  async getAllUsers() {
    return get('/admin/management/users');
  }

  async getUsersByRole(role: Role) {
    return get(`/admin/management/users/role/${role}`);
  }

  async updateUserRole(userId: string, role: Role) {
    return patch(`/admin/management/users/${userId}/role`, { role });
  }

  async deleteUser(userId: string) {
    await del(`/admin/management/users/${userId}`);
    return true;
  }

  async getAllCourses() {
    return get('/admin/management/courses');
  }

  async getAllNotes() {
    return get('/admin/management/notes');
  }

  async createNote(noteData: Record<string, unknown>) {
    return post('/admin/management/notes', noteData);
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
    return patch(`/admin/management/courses/${courseId}/status`, { isPublished });
  }

  async getDashboardStats() {
    return get('/admin/management/dashboard/stats');
  }

  async getUserProgress(userId: string) {
    return get(`/admin/management/users/${userId}/progress`);
  }

  async getTeacherAnalytics(teacherId: string) {
    return get(`/admin/management/teachers/${teacherId}/analytics`);
  }
}

export const adminService = new AdminService();

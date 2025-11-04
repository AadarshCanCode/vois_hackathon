import type { Course, Module } from '@types';
import { API_BASE_URL, del, get, patch, post } from '@lib/apiClient';

class CourseService {
  async createCourse(courseData: Partial<Course>) {
    return post('/courses', courseData);
  }

  async updateCourse(id: string, updates: Partial<Course>) {
    return patch(`/courses/${id}`, updates);
  }

  async deleteCourse(id: string) {
    await del(`/courses/${id}`);
    return true;
  }

  async getCoursesByTeacher(teacherId: string) {
    return get<Course[]>(`/courses/teacher/${teacherId}`);
  }

  async getAllCourses(): Promise<Course[]> {
    return get<Course[]>('/courses');
  }

  async getCourseById(id: string): Promise<Course | null> {
    return get<Course | null>(`/courses/${id}`);
  }

  async getModuleCount(courseId: string): Promise<number> {
    const modules = await this.getModulesByCourse(courseId);
    return modules.length;
  }

  async createModule(moduleData: Partial<Module>) {
    return post('/courses/modules', moduleData);
  }

  async updateModule(id: string, updates: Partial<Module>) {
    return patch(`/courses/modules/${id}`, updates);
  }

  async getModulesByCourse(courseId: string) {
    return get<Module[]>(`/courses/${courseId}/modules`);
  }

  async updateProgress(progressData: unknown) {
    return post('/courses/progress', progressData);
  }

  async getUserProgress(userId: string, courseId: string) {
    return get<unknown[]>(`/courses/${courseId}/progress?userId=${encodeURIComponent(userId)}`);
  }

  async enrollInCourse(userId: string, courseId: string) {
    return post(`/courses/${courseId}/enroll`, { userId });
  }

  async getUserEnrollments(userId: string) {
    return get(`/courses/user/${userId}/enrollments`);
  }

  async uploadFile(file: File, folder = 'courses') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${API_BASE_URL}/courses/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json() as { url: string };
    return data.url;
  }
}

export const courseService = new CourseService();

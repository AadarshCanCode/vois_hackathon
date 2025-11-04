import type { PostgrestError } from '@supabase/supabase-js';
import type { Express } from 'express';
import { supabase } from '../../lib/supabase-client';

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

export const adminManagementService = {
  async getAllUsers() {
    const client = requireSupabase();
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    handleError('Failed to fetch users', error);
    return data ?? [];
  },

  async getUsersByRole(role: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });
    handleError('Failed to fetch users by role', error);
    return data ?? [];
  },

  async updateUserRole(userId: string, role: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();
    handleError('Failed to update user role', error);
    return data ?? null;
  },

  async deleteUser(userId: string) {
    const client = requireSupabase();
    const { error } = await client
      .from('users')
      .delete()
      .eq('id', userId);
    handleError('Failed to delete user', error);
    return true;
  },

  async getAllCourses() {
    const client = requireSupabase();
    const { data, error } = await client
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    handleError('Failed to fetch courses', error);
    return data ?? [];
  },

  async getAllNotes() {
    const client = requireSupabase();
    const { data, error } = await client
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    handleError('Failed to fetch notes', error);
    return data ?? [];
  },

  async createNote(noteData: Record<string, unknown>) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('notes')
      .insert([noteData])
      .select()
      .single();
    handleError('Failed to create note', error);
    return data ?? null;
  },

  async uploadFile(file: Express.Multer.File, folder = 'uploads') {
    const client = requireSupabase();
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('uploads')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype
      });
    handleError('Failed to upload file', uploadError);

    const { data } = client.storage
      .from('uploads')
      .getPublicUrl(filePath);
    return data.publicUrl;
  },

  async updateCourseStatus(courseId: string, isPublished: boolean) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('courses')
      .update({ is_published: isPublished })
      .eq('id', courseId)
      .select()
      .single();
    handleError('Failed to update course status', error);
    return data ?? null;
  },

  async getDashboardStats() {
    const client = requireSupabase();

    const { data: userStats, error: userError } = await client
      .from('users')
      .select('role')
      .neq('role', 'admin');
    handleError('Failed to fetch user stats', userError);

    const { data: courseStats, error: courseError } = await client
      .from('courses')
      .select('is_published, enrollment_count');
    handleError('Failed to fetch course stats', courseError);

    const { data: enrollmentStats, error: enrollmentError } = await client
      .from('course_enrollments')
      .select('enrolled_at');
    handleError('Failed to fetch enrollment stats', enrollmentError);

    const teachers = (userStats ?? []).filter(u => u.role === 'teacher').length;
    const students = (userStats ?? []).filter(u => u.role === 'student').length;
    const totalCourses = courseStats?.length ?? 0;
    const publishedCourses = (courseStats ?? []).filter(c => c.is_published).length;
    const totalEnrollments = enrollmentStats?.length ?? 0;

    const thisMonth = (enrollmentStats ?? []).filter(e => {
      if (!e?.enrolled_at) return false;
      const enrollDate = new Date(e.enrolled_at as string);
      const now = new Date();
      return enrollDate.getMonth() === now.getMonth() && enrollDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      users: {
        teachers,
        students,
        total: teachers + students
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        draft: totalCourses - publishedCourses
      },
      enrollments: {
        total: totalEnrollments,
        thisMonth
      }
    };
  },

  async getUserProgress(userId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('user_progress')
      .select('*, course:courses(title, difficulty), module:course_modules(title)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    handleError('Failed to fetch user progress', error);
    return data ?? [];
  },

  async getTeacherAnalytics(teacherId: string) {
    const client = requireSupabase();

    const { data: courses, error: coursesError } = await client
      .from('courses')
      .select('*, course_enrollments(count)')
      .eq('teacher_id', teacherId);
    handleError('Failed to fetch teacher courses', coursesError);

    const courseIds = (courses ?? []).map((c: { id: string }) => c.id);
    if (courseIds.length === 0) {
      return {
        courses: 0,
        totalEnrollments: 0,
        completedModules: 0,
        averageScore: 0
      };
    }

    const { data: progress, error: progressError } = await client
      .from('user_progress')
      .select('*')
      .in('course_id', courseIds);
    handleError('Failed to fetch progress data', progressError);

    const totalEnrollments = progress?.length ?? 0;
    const completedModules = (progress ?? []).filter(p => p.completed).length;
    const averageScore = totalEnrollments > 0
      ? (progress ?? []).reduce((sum, p) => sum + (p.quiz_score ?? 0), 0) / totalEnrollments
      : 0;

    return {
      courses: courses?.length ?? 0,
      totalEnrollments,
      completedModules,
      averageScore
    };
  }
};

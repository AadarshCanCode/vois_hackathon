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

export const courseService = {
  async createCourse(courseData: Record<string, unknown>) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('courses')
      .insert([
        {
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          difficulty: courseData.difficulty,
          estimated_hours: courseData.estimated_hours ?? 0,
          teacher_id: courseData.teacher_id,
          is_published: courseData.is_published ?? false,
          enrollment_count: 0,
          rating: 0
        }
      ])
      .select()
      .single();
    handleError('Failed to create course', error);
    return data;
  },

  async updateCourse(id: string, updates: Record<string, unknown>) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    handleError('Failed to update course', error);
    return data;
  },

  async deleteCourse(id: string) {
    const client = requireSupabase();
    const { error } = await client
      .from('courses')
      .delete()
      .eq('id', id);
    handleError('Failed to delete course', error);
    return true;
  },

  async getCoursesByTeacher(teacherId: string) {
    const client = requireSupabase();
    const { data: coursesData, error: coursesError } = await client
      .from('courses')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    handleError('Failed to fetch teacher courses', coursesError);

    const { data: teacherData, error: teacherError } = await client
      .from('users')
      .select('name, email, profile_image')
      .eq('id', teacherId)
      .maybeSingle();
    if (teacherError) {
      console.warn('Teacher query error:', teacherError.message);
    }

    return (coursesData ?? []).map(course => ({
      ...course,
      teacher: teacherData ?? null
    }));
  },

  async getAllCourses() {
    const client = requireSupabase();
    const { data, error } = await client
      .from('courses')
      .select('*, course_modules(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    handleError('Failed to fetch courses', error);
    return data ?? [];
  },

  async getCourseById(id: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('courses')
      .select('*, course_modules(*)')
      .eq('id', id)
      .single();
    handleError('Failed to fetch course', error);
    return data;
  },

  async getModuleCount(courseId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('course_modules')
      .select('id')
      .eq('course_id', courseId);
    handleError('Failed to count modules', error);
    return data?.length ?? 0;
  },

  async createModule(moduleData: Record<string, unknown>) {
    const client = requireSupabase();
    const currentCount = await this.getModuleCount(String(moduleData.course_id));
    if (currentCount >= 10) {
      throw new Error('Maximum module limit (10) reached for this course');
    }

    const { data, error } = await client
      .from('course_modules')
      .insert([
        {
          ...moduleData,
          module_order: currentCount + 1,
          is_published: false
        }
      ])
      .select()
      .single();
    handleError('Failed to create module', error);
    return data;
  },

  async updateModule(id: string, updates: Record<string, unknown>) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('course_modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    handleError('Failed to update module', error);
    return data;
  },

  async getModulesByCourse(courseId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('module_order', { ascending: true });
    handleError('Failed to fetch modules', error);
    return data ?? [];
  },

  async updateProgress(progressData: Record<string, unknown>) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('user_progress')
      .upsert([progressData])
      .select()
      .single();
    handleError('Failed to update progress', error);
    return data;
  },

  async getUserProgress(userId: string, courseId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);
    handleError('Failed to fetch user progress', error);
    return data ?? [];
  },

  async enrollInCourse(userId: string, courseId: string) {
    const client = requireSupabase();

    const { data: existing, error: existingErr } = await client
      .from('course_enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();
    if (existingErr) {
      console.warn('Error checking existing enrollment:', existingErr.message);
    }
    if (existing) {
      return existing;
    }

    const { data: inserted, error: insertErr } = await client
      .from('course_enrollments')
      .insert([{ user_id: userId, course_id: courseId }])
      .select()
      .single();
    handleError('Failed to enroll in course', insertErr);

    const { error: updateErr } = await client
      .from('courses')
      .update({ enrollment_count: (inserted?.enrollment_count ?? 0) + 1 })
      .eq('id', courseId)
      .select()
      .single();
    if (updateErr) {
      console.warn('Failed to increment course enrollment_count, attempting fallback:', updateErr.message);
      const { data: courseRow } = await client
        .from('courses')
        .select('enrollment_count')
        .eq('id', courseId)
        .maybeSingle();
      const newCount = (courseRow?.enrollment_count ?? 0) + 1;
      await client
        .from('courses')
        .update({ enrollment_count: newCount })
        .eq('id', courseId);
    }

    return inserted;
  },

  async getUserEnrollments(userId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('course_enrollments')
      .select('*, course:courses(*, teacher:users(name, profile_image))')
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });
    handleError('Failed to fetch enrollments', error);
    return data ?? [];
  },

  async uploadFile(file: Express.Multer.File, folder = 'courses') {
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
  }
};

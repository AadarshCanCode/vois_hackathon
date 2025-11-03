import React, { useState, useEffect } from 'react';
import { BookOpen, Users, PlusCircle, BarChart, Edit, Trash2, Eye } from 'lucide-react';
import { CourseCreation } from './CourseCreation';
import { courseService } from '@services/courseService';
import type { Course } from '@types';
import { useAuth } from '@context/AuthContext';

export const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      loadTeacherCourses();
    }
  }, [user]);

  const loadTeacherCourses = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      const data = await courseService.getCoursesByTeacher(user.id);
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter(c => c.id !== courseId));
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const updated = await courseService.updateCourse(course.id, {
        is_published: !course.is_published
      } as Partial<Course>);
      setCourses(courses.map(c => c.id === course.id ? updated : c));
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Teacher Dashboard</h1>
            <p className="text-muted">Create and manage your cybersecurity courses</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 btn-primary px-6 py-3 rounded-xl hover:scale-105 shadow-md"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Course</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm font-medium">My Courses</p>
                <p className="text-3xl font-bold text-contrast">{courses.length}</p>
              </div>
              <BookOpen className="h-12 w-12 text-accent" />
            </div>
          </div>

          <div className="bg-card border border-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-contrast">{courses.filter(c => c.is_published).length}</p>
              </div>
              <Eye className="h-12 w-12 text-accent" />
            </div>
          </div>

          <div className="bg-card border border-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-contrast">{courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0)}</p>
              </div>
              <Users className="h-12 w-12 text-accent" />
            </div>
          </div>

          <div className="bg-card border border-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm font-medium">Avg Rating</p>
                <p className="text-3xl font-bold text-contrast">
                  {courses.length > 0 ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <BarChart className="h-12 w-12 text-accent" />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
              <p className="text-slate-400 mb-6">Start creating your first cybersecurity course to share with students.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{course.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.difficulty === 'advanced' ? 'bg-red-500/20 text-red-400' :
                          course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {course.difficulty}
                        </span>
                        {course.is_published ? (
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                            Published
                          </span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 mb-4">{course.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-slate-400">
                        <span>{course.enrollment_count} students enrolled</span>
                        <span>⭐ {(course.rating || 0).toFixed(1)} rating</span>
                        <span>{course.estimated_hours}h estimated</span>
                        <span>Created {new Date(course.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className={`p-2 rounded-lg transition-colors ${
                          course.is_published
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                        title={course.is_published ? 'Unpublish' : 'Publish'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Creation Modal */}
      {(showCreateForm || editingCourse) && (
        <CourseCreation
          onSuccess={(savedCourse) => {
            if (editingCourse) {
              setCourses(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
            } else {
              setCourses(prev => [savedCourse, ...prev]);
            }
            setShowCreateForm(false);
            setEditingCourse(null);
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingCourse(null);
          }}
          course={editingCourse}
        />
      )}
    </div>
  );
};
import React from 'react';
import { Lock, Play, CheckCircle, Clock, BookOpen } from 'lucide-react';
// Note: we no longer rely on static sample courses; DB-backed data is used via courseService
import { useEffect, useState } from 'react';
import type { Course, Module, User } from '@types';
import { courseService } from '@services/courseService';
import { useAuth } from '@context/AuthContext';

interface CourseListProps {
  onCourseSelect: (courseId: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ onCourseSelect }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const levelToAllowedModules = (level?: User['level']): number => {
    switch (level) {
      case 'beginner':
        return 3; // first 3 modules
      case 'intermediate':
        return 7; // first 7 modules
      case 'advanced':
        return Number.POSITIVE_INFINITY; // all modules
      default:
        return 0;
    }
  };

  const allowedCount = levelToAllowedModules(user?.level as User['level'] | undefined);
  const canAccessCourses = Boolean(user?.completedAssessment) || user?.role === 'admin';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await courseService.getAllCourses();
        if (mounted && Array.isArray(data)) setCourses(data);
      } catch (e) {
        console.error('Failed to load courses:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Cybersecurity Courses</h1>
          <p className="text-slate-300">
            Master the OWASP Top 10 web application security risks with hands-on learning
          </p>
        </div>

        {/* Assessment notice */}
        {!canAccessCourses && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-bold text-yellow-800">Complete Assessment First</h3>
                <p className="text-yellow-700">
                  Take the initial assessment test to unlock your personalized learning path
                  and gain access to all courses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Course list */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center text-slate-400">Loading courses...</div>
          ) : (
            courses.map((course: Course) => {
            const isUnlocked = canAccessCourses;
            const progress = course.progress ?? 0;

            return (
              <div
                key={course.id}
                className="bg-slate-800 rounded-lg shadow-md border border-slate-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-xl font-bold text-slate-100">{course.title}</h2>
                        {isUnlocked ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Lock className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <p className="text-slate-300 mb-4">{course.description}</p>

                      <div className="flex items-center space-x-6 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-slate-300" />
                  <span>{(course.modules ?? course.course_modules ?? []).length} Modules</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-slate-300" />
                          <span>~{((course.modules ?? course.course_modules ?? []).length) * 2} hours</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => isUnlocked && onCourseSelect(course.id)}
                      disabled={!isUnlocked}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                        isUnlocked
                          ? 'bg-amber-600 text-slate-900 hover:bg-amber-700'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isUnlocked ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      <span>{isUnlocked ? 'Start Course' : 'Locked'}</span>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {isUnlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Module Preview */}
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-slate-100 mb-3">Course Modules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(course.modules ?? course.course_modules ?? []).slice(0, 6).map((module: Module, index: number) => {
                        const moduleUnlocked = (index < allowedCount && canAccessCourses) || user?.role === 'admin';
                        return (
                          <div key={module.id} className="flex items-center space-x-2 text-sm">
                            {moduleUnlocked ? (
                              module.completed ? (
                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-slate-600"></div>
                              )
                            ) : (
                              <Lock className="h-4 w-4 text-slate-500" />
                            )}

                            <span className={moduleUnlocked ? 'text-slate-100' : 'text-slate-400'}>
                              {index + 1}. {module.title.split(' – ')[1] || module.title}
                            </span>
                          </div>
                        );
                      })}

                      {course.modules && course.modules.length > 6 && (
                        <div className="text-sm text-slate-400 col-span-2">
                          +{course.modules.length - 6} more modules...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};

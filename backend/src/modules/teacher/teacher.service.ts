import type { TeacherCourse, TeacherDashboardSummary, TeacherProfile } from './teacher.types';

const sampleTeacher: TeacherProfile = {
  id: 'teacher-001',
  name: 'Demo Teacher',
  primaryDiscipline: 'Cybersecurity',
  totalCourses: 3
};

const sampleTeacherCourses: TeacherCourse[] = [
  { id: 'csec-001', title: 'Cybersecurity Fundamentals', studentCount: 42 },
  { id: 'csec-002', title: 'Advanced Pen Testing', studentCount: 28 },
  { id: 'csec-003', title: 'Secure Coding Practices', studentCount: 35 }
];

export const teacherService = {
  getDashboardOverview(): TeacherDashboardSummary {
    return {
      profile: sampleTeacher,
      courses: sampleTeacherCourses
    };
  }
};

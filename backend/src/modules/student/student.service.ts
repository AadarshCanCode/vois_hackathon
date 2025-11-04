import type { StudentDashboardSummary, StudentCourseSummary, StudentProfile } from './student.types';

const sampleProfile: StudentProfile = {
  id: 'student-001',
  name: 'Demo Student',
  enrolledCourses: ['netsec-basics', 'ethical-hacking-101'],
  upcomingAssessments: ['assessment-001'],
  lastLogin: new Date().toISOString()
};

const sampleCourses: StudentCourseSummary[] = [
  { id: 'netsec-basics', title: 'Network Security Basics', progress: 0.65 },
  { id: 'ethical-hacking-101', title: 'Ethical Hacking 101', progress: 0.42 }
];

export const studentService = {
  getDashboardSummary(): StudentDashboardSummary {
    return {
      profile: sampleProfile,
      stats: {
        completedCourses: sampleCourses.filter(course => course.progress >= 1).length,
        activeCourses: sampleCourses.filter(course => course.progress < 1).length,
        courseSummaries: sampleCourses
      }
    };
  }
};

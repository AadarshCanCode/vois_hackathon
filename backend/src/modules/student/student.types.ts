export interface StudentProfile {
  id: string;
  name: string;
  enrolledCourses: string[];
  upcomingAssessments: string[];
  lastLogin: string | null;
}

export interface StudentCourseSummary {
  id: string;
  title: string;
  progress: number;
}

export interface StudentDashboardStats {
  completedCourses: number;
  activeCourses: number;
  courseSummaries: StudentCourseSummary[];
}

export interface StudentDashboardSummary {
  profile: StudentProfile;
  stats: StudentDashboardStats;
}

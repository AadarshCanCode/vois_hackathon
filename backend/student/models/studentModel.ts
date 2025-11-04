export interface StudentProfileData {
  id: string;
  name: string;
  enrolledCourses?: string[];
  upcomingAssessments?: string[];
  lastLogin?: string | null;
}

export interface StudentCourseSummaryData {
  id: string;
  title: string;
  progress?: number;
}

export interface StudentStatsData {
  completedCourses: number;
  activeCourses: number;
  courseSummaries: StudentCourseSummary[];
}

export interface StudentDashboardSummaryData {
  profile: StudentProfileData;
  stats: StudentStatsData;
}

export class StudentProfile {
  id: string;
  name: string;
  enrolledCourses: string[];
  upcomingAssessments: string[];
  lastLogin: string | null;

  constructor({ id, name, enrolledCourses = [], upcomingAssessments = [], lastLogin = null }: StudentProfileData) {
    this.id = id;
    this.name = name;
    this.enrolledCourses = enrolledCourses;
    this.upcomingAssessments = upcomingAssessments;
    this.lastLogin = lastLogin;
  }
}

export class StudentCourseSummary {
  id: string;
  title: string;
  progress: number;

  constructor({ id, title, progress = 0 }: StudentCourseSummaryData) {
    this.id = id;
    this.title = title;
    this.progress = progress;
  }
}

export class StudentDashboardSummary {
  profile: StudentProfileData;
  stats: StudentStatsData;

  constructor({ profile, stats }: StudentDashboardSummaryData) {
    this.profile = profile;
    this.stats = stats;
  }
}
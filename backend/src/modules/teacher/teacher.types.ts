export interface TeacherProfile {
  id: string;
  name: string;
  primaryDiscipline: string;
  totalCourses: number;
}

export interface TeacherCourse {
  id: string;
  title: string;
  studentCount: number;
}

export interface TeacherDashboardSummary {
  profile: TeacherProfile;
  courses: TeacherCourse[];
}

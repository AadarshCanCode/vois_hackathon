export interface TeacherProfileData {
  id: string;
  name: string;
  primaryDiscipline: string;
  totalCourses?: number;
}

export interface TeacherCourseData {
  id: string;
  title: string;
  studentCount?: number;
}

export interface TeacherDashboardSummaryData {
  profile: TeacherProfileData;
  courses: TeacherCourse[];
}

export class TeacherProfile {
  id: string;
  name: string;
  primaryDiscipline: string;
  totalCourses: number;

  constructor({ id, name, primaryDiscipline, totalCourses = 0 }: TeacherProfileData) {
    this.id = id;
    this.name = name;
    this.primaryDiscipline = primaryDiscipline;
    this.totalCourses = totalCourses;
  }
}

export class TeacherCourse {
  id: string;
  title: string;
  studentCount: number;

  constructor({ id, title, studentCount = 0 }: TeacherCourseData) {
    this.id = id;
    this.title = title;
    this.studentCount = studentCount;
  }
}

export class TeacherDashboardSummary {
  profile: TeacherProfileData;
  courses: TeacherCourse[];

  constructor({ profile, courses }: TeacherDashboardSummaryData) {
    this.profile = profile;
    this.courses = courses;
  }
}
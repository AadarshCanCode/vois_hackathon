export class TeacherProfile {
  constructor({ id, name, primaryDiscipline, totalCourses = 0 }) {
    this.id = id;
    this.name = name;
    this.primaryDiscipline = primaryDiscipline;
    this.totalCourses = totalCourses;
  }
}

export class TeacherCourse {
  constructor({ id, title, studentCount = 0 }) {
    this.id = id;
    this.title = title;
    this.studentCount = studentCount;
  }
}

export class TeacherDashboardSummary {
  constructor({ profile, courses }) {
    this.profile = profile;
    this.courses = courses;
  }
}

export class StudentProfile {
  constructor({ id, name, enrolledCourses = [], upcomingAssessments = [], lastLogin = null }) {
    this.id = id;
    this.name = name;
    this.enrolledCourses = enrolledCourses;
    this.upcomingAssessments = upcomingAssessments;
    this.lastLogin = lastLogin;
  }
}

export class StudentCourseSummary {
  constructor({ id, title, progress = 0 }) {
    this.id = id;
    this.title = title;
    this.progress = progress;
  }
}

export class StudentDashboardSummary {
  constructor({ profile, stats }) {
    this.profile = profile;
    this.stats = stats;
  }
}

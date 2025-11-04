import express from 'express';
import cors from 'cors';

import { studentRouter } from './modules/student/student.routes';
import { teacherRouter } from './modules/teacher/teacher.routes';
import { adminApiRouter } from './modules/admin/admin.api.routes';
import { adminLegacyRouter } from './modules/admin/admin.legacy.routes';
import { adminManagementRouter } from './modules/admin/admin.management.routes';
import { authRouter } from './modules/auth/auth.routes';
import { courseRouter } from './modules/courses/course.routes';
import { assessmentRouter } from './modules/assessments/assessment.routes';
import { learningPathRouter } from './modules/learning/learning-path.routes';
import { learnerMemoryRouter } from './modules/memory/learner-memory.routes';
import { aiRouter } from './modules/ai/ai.routes';
import { ragRouter } from './modules/rag/rag.routes';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    message: 'VOIS Hackathon API',
    modules: ['student', 'teacher', 'admin', 'courses', 'auth', 'assessments', 'ai', 'rag']
  });
});

app.use('/api/auth', authRouter);
app.use('/api/student', studentRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/admin', adminApiRouter);
app.use('/api/admin/management', adminManagementRouter);
app.use('/api/courses', courseRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/learning-path', learningPathRouter);
app.use('/api/memory', learnerMemoryRouter);
app.use('/api/ai', aiRouter);
app.use('/api/rag', ragRouter);

// Legacy endpoints to preserve existing integrations
app.use('/', adminLegacyRouter);

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import studentRoutes from './student/routes/index.js';
import teacherRoutes from './teacher/routes/index.js';
import adminApiRoutes, { legacyRoutes as adminLegacyRoutes } from './admin/routes/index.js';
import authRoutes from './auth/routes.js';
import assessmentRoutes from './assessment/routes.js';
import dataRoutes from './data/routes.js';

const app: Express = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminApiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/data', dataRoutes);

// Legacy endpoints to preserve existing integrations
app.use('/', adminLegacyRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'VOIS Hackathon API',
    modules: ['student', 'teacher', 'admin', 'auth', 'assessment', 'data'],
    endpoints: {
      auth: '/api/auth',
      assessment: '/api/assessment',
      data: '/api/data',
      student: '/api/student',
      teacher: '/api/teacher',
      admin: '/api/admin'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;
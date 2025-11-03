import express from 'express';
import cors from 'cors';

import studentRoutes from './student/routes/index.mjs';
import teacherRoutes from './teacher/routes/index.mjs';
import adminApiRoutes, { legacyRoutes as adminLegacyRoutes } from './admin/routes/index.mjs';

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminApiRoutes);

// Legacy endpoints to preserve existing integrations
app.use('/', adminLegacyRoutes);

app.get('/', (_req, res) => {
  res.json({
    message: 'VOIS Hackathon API',
    modules: ['student', 'teacher', 'admin']
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;

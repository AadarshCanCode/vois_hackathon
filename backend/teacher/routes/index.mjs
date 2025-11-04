import { Router } from 'express';
import { getTeacherDashboardOverview } from '../services/teacherService.mjs';

const router = Router();

router.get('/overview', (_req, res) => {
  const overview = getTeacherDashboardOverview();
  res.json(overview);
});

export default router;

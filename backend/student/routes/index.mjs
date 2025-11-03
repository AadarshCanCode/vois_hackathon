import { Router } from 'express';
import { getStudentDashboardSummary } from '../services/studentService.mjs';

const router = Router();

router.get('/overview', (_req, res) => {
  const summary = getStudentDashboardSummary();
  res.json(summary);
});

export default router;

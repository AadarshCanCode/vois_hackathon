import { Router } from 'express';
import { studentService } from './student.service';

const router = Router();

router.get('/overview', (_req, res) => {
  const summary = studentService.getDashboardSummary();
  res.json(summary);
});

export const studentRouter = router;

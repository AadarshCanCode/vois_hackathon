import { Router } from 'express';
import { teacherService } from './teacher.service';

const router = Router();

router.get('/overview', (_req, res) => {
  const overview = teacherService.getDashboardOverview();
  res.json(overview);
});

export const teacherRouter = router;

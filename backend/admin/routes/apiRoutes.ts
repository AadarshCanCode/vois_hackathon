import { Router, Request, Response } from 'express';
import { getAdminStatus } from '../services/proxyService.js';
import { checkModelAvailability } from '../services/modelCheckService.js';
import { recordProctorLog } from '../services/proctoringService.js';

const router = Router();

router.get('/status', (_req: Request, res: Response) => {
  res.json(getAdminStatus());
});

router.get('/models', (_req: Request, res: Response) => {
  try {
    const availability = checkModelAvailability();
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post('/proctor/logs', (req: Request, res: Response) => {
  try {
    const result = recordProctorLog(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
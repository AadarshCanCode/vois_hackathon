import { Router } from 'express';
import { getAdminStatus } from '../services/proxyService.mjs';
import { checkModelAvailability } from '../services/modelCheckService.mjs';
import { recordProctorLog } from '../services/proctoringService.mjs';

const router = Router();

router.get('/status', (_req, res) => {
  res.json(getAdminStatus());
});

router.get('/models', (_req, res) => {
  try {
    const availability = checkModelAvailability();
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/proctor/logs', (req, res) => {
  try {
    const result = recordProctorLog(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { proxyRequest } from '../services/proxyService.js';
import { recordProctorLog } from '../services/proctoringService.js';
import { checkModelAvailability } from '../services/modelCheckService.js';

const router = Router();

router.get('/proxy', async (req: Request, res: Response) => {
  try {
    const target = req.query.url as string;
    const result = await proxyRequest(target);

    if (result.error) {
      return res.status(result.error.status).send(result.error.message);
    }

    Object.entries(result.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(result.status).send(result.body);
  } catch (error) {
    console.error(error);
    res.status(500).send('Proxy error');
  }
});

router.post('/proctor-logs', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    recordProctorLog(payload);
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error('proctor log error', error);
    res.status(500).send({ ok: false });
  }
});

router.get('/test-models', (_req: Request, res: Response) => {
  try {
    const availability = checkModelAvailability();
    res.json(availability);
  } catch (error) {
    console.error('Model check error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
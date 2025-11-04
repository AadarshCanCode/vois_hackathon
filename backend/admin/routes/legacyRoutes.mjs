import { Router } from 'express';
import { proxyRequest } from '../services/proxyService.mjs';
import { recordProctorLog } from '../services/proctoringService.mjs';
import { checkModelAvailability } from '../services/modelCheckService.mjs';

const router = Router();

router.get('/proxy', async (req, res) => {
  try {
    const target = req.query.url;
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

router.post('/proctor-logs', (req, res) => {
  try {
    const payload = req.body;
    recordProctorLog(payload);
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error('proctor log error', error);
    res.status(500).send({ ok: false });
  }
});

router.get('/test-models', (_req, res) => {
  try {
    const availability = checkModelAvailability();
    res.json(availability);
  } catch (error) {
    console.error('Model check error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

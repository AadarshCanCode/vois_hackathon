import { Router } from 'express';
import { proxyRequest } from './proxy.service';
import { recordProctorLog } from './proctoring.service';
import { checkModelAvailability } from './model-check.service';

export const adminLegacyRouter = Router();

adminLegacyRouter.get('/proxy', async (req, res) => {
  try {
    const target = req.query.url;
    const result = await proxyRequest(String(target ?? ''));

    if ('error' in result && result.error) {
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

adminLegacyRouter.post('/proctor-logs', (req, res) => {
  try {
    const payload = req.body;
    recordProctorLog(payload);
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error('proctor log error', error);
    res.status(500).send({ ok: false });
  }
});

adminLegacyRouter.get('/test-models', (_req, res) => {
  try {
    const availability = checkModelAvailability();
    res.json(availability);
  } catch (error) {
    console.error('Model check error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Model check error' });
  }
});

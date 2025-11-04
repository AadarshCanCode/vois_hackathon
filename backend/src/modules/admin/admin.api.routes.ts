import { Router } from 'express';
import { getAdminStatus } from './proxy.service';
import { checkModelAvailability } from './model-check.service';
import { recordProctorLog } from './proctoring.service';

export const adminApiRouter = Router();

adminApiRouter.get('/status', (_req, res) => {
  res.json(getAdminStatus());
});

adminApiRouter.get('/models', (_req, res, next) => {
  try {
    const availability = checkModelAvailability();
    res.json(availability);
  } catch (error) {
    next(error);
  }
});

adminApiRouter.post('/proctor/logs', (req, res, next) => {
  try {
    const result = recordProctorLog(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

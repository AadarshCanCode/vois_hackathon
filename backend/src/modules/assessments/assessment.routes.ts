import { Router } from 'express';
import { assessmentService } from './assessment.service';

export const assessmentRouter = Router();

assessmentRouter.post('/attempts', async (req, res, next) => {
  try {
    const { userId, context } = req.body ?? {};
    if (typeof userId !== 'string') {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    const attempt = await assessmentService.startAttempt(userId, context);
    res.status(201).json(attempt);
  } catch (error) {
    next(error);
  }
});

assessmentRouter.post('/answers', async (req, res, next) => {
  try {
    await assessmentService.submitAnswer(req.body ?? {});
    res.status(201).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

assessmentRouter.get('/attempts/:id/results', async (req, res, next) => {
  try {
    const results = await assessmentService.getAttemptResults(req.params.id);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

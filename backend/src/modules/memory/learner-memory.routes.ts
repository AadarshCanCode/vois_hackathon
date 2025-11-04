import { Router } from 'express';
import { learnerMemoryService } from './learner-memory.service';

export const learnerMemoryRouter = Router();

learnerMemoryRouter.post('/', async (req, res, next) => {
  try {
    const { userId, facts } = req.body ?? {};
    if (typeof userId !== 'string' || !Array.isArray(facts)) {
      res.status(400).json({ error: 'userId and facts array are required' });
      return;
    }
    await learnerMemoryService.upsertFacts(userId, facts);
    res.status(201).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

learnerMemoryRouter.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = Number(req.query.limit ?? 10);
    const context = await learnerMemoryService.getContext(userId, Number.isNaN(limit) ? 10 : limit);
    res.json({ context });
  } catch (error) {
    next(error);
  }
});

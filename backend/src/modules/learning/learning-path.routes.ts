import { Router } from 'express';
import { learningPathService } from './learning-path.service';

export const learningPathRouter = Router();

learningPathRouter.post('/allocate', async (req, res, next) => {
  try {
    const { userId, courseId, analysis } = req.body ?? {};
    if (typeof userId !== 'string' || typeof courseId !== 'string') {
      res.status(400).json({ error: 'userId and courseId are required' });
      return;
    }
    const modules = await learningPathService.allocateInitialPath(userId, courseId, analysis);
    res.status(201).json({ modules });
  } catch (error) {
    next(error);
  }
});

learningPathRouter.post('/rebalance', async (req, res, next) => {
  try {
    const { userId, courseId } = req.body ?? {};
    if (typeof userId !== 'string' || typeof courseId !== 'string') {
      res.status(400).json({ error: 'userId and courseId are required' });
      return;
    }
    const progress = await learningPathService.rebalance(userId, courseId);
    res.json({ progress });
  } catch (error) {
    next(error);
  }
});

import { Router } from 'express';
import { ragService } from './rag.service';

export const ragRouter = Router();

ragRouter.post('/analyze', async (req, res, next) => {
  try {
    const { responses } = req.body ?? {};
    if (!Array.isArray(responses)) {
      res.status(400).json({ error: 'responses array is required' });
      return;
    }
    const analysis = await ragService.analyzeAssessment(responses);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

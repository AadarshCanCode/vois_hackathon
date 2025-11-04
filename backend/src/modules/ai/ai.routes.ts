import { Router } from 'express';
import { aiService } from './ai.service';

export const aiRouter = Router();

aiRouter.get('/status', (_req, res) => {
  res.json({ enabled: aiService.isEnabled() });
});

aiRouter.post('/chat', async (req, res, next) => {
  try {
    const { prompt, systemPrompt } = req.body ?? {};
    if (typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'prompt is required' });
      return;
    }
    const response = await aiService.chat(prompt, systemPrompt);
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

aiRouter.post('/questions', async (req, res, next) => {
  try {
    const { topics, difficulty, count } = req.body ?? {};
    if (!Array.isArray(topics) || topics.length === 0) {
      res.status(400).json({ error: 'topics array is required' });
      return;
    }
    const questions = await aiService.generateQuestions(topics, difficulty ?? 'medium', count);
    res.json({ questions });
  } catch (error) {
    next(error);
  }
});

aiRouter.post('/course-outline', async (req, res, next) => {
  try {
    const modules = await aiService.generateCourseOutline(req.body ?? {});
    res.json({ modules });
  } catch (error) {
    next(error);
  }
});

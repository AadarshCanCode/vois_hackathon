import { Router } from 'express';
import { authService } from './auth.service';

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/register', async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', (_req, res) => {
  // Client is responsible for clearing sessions/local state.
  res.status(204).send();
});

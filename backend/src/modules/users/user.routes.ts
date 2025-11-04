import { Router } from 'express';
import { userService } from './user.service';

export const userRouter = Router();

userRouter.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body ?? {};
    const user = await userService.updateUser(id, updates);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/:id/certificates', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { url } = req.body ?? {};
    if (typeof url !== 'string' || !url.trim()) {
      res.status(400).json({ error: 'url is required' });
      return;
    }
    const user = await userService.appendCertificate(id, url.trim());
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

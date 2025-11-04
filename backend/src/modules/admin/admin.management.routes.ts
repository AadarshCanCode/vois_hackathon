import { Router } from 'express';
import multer from 'multer';
import type { Request } from 'express';
import { adminManagementService } from './admin.management.service';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const adminManagementRouter = Router();

adminManagementRouter.get('/users', async (_req, res, next) => {
  try {
    const users = await adminManagementService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get('/users/role/:role', async (req, res, next) => {
  try {
    const { role } = req.params;
    const users = await adminManagementService.getUsersByRole(role);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await adminManagementService.updateUserRole(id, role);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminManagementService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get('/courses', async (_req, res, next) => {
  try {
    const courses = await adminManagementService.getAllCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get('/notes', async (_req, res, next) => {
  try {
    const notes = await adminManagementService.getAllNotes();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.post('/notes', async (req, res, next) => {
  try {
    const note = await adminManagementService.createNote(req.body ?? {});
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.post('/notes/upload', upload.single('file'), async (req, res, next) => {
  try {
    const fileReq = req as Request & { file?: Express.Multer.File };
    if (!fileReq.file) {
      res.status(400).json({ error: 'File is required' });
      return;
    }
    const url = await adminManagementService.uploadFile(fileReq.file, req.body.folder);
    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.patch('/courses/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const course = await adminManagementService.updateCourseStatus(id, Boolean(isPublished));
    res.json(course);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get('/dashboard/stats', async (_req, res, next) => {
  try {
    const stats = await adminManagementService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get('/users/:id/progress', async (req, res, next) => {
  try {
    const { id } = req.params;
    const progress = await adminManagementService.getUserProgress(id);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get('/teachers/:id/analytics', async (req, res, next) => {
  try {
    const { id } = req.params;
    const analytics = await adminManagementService.getTeacherAnalytics(id);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

adminManagementRouter.get('/assessments/responses', async (_req, res, next) => {
  try {
    const responses = await adminManagementService.getAssessmentResponses();
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

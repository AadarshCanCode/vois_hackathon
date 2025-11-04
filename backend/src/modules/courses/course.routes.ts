import { Router } from 'express';
import multer from 'multer';
import { courseService } from './course.service';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

export const courseRouter = Router();

courseRouter.get('/', async (_req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

courseRouter.post('/', async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body ?? {});
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
});

courseRouter.get('/:id', async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json(course);
  } catch (error) {
    next(error);
  }
});

courseRouter.patch('/:id', async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body ?? {});
    res.json(course);
  } catch (error) {
    next(error);
  }
});

courseRouter.delete('/:id', async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

courseRouter.get('/teacher/:teacherId', async (req, res, next) => {
  try {
    const courses = await courseService.getCoursesByTeacher(req.params.teacherId);
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

courseRouter.get('/:id/modules', async (req, res, next) => {
  try {
    const modules = await courseService.getModulesByCourse(req.params.id);
    res.json(modules);
  } catch (error) {
    next(error);
  }
});

courseRouter.post('/modules', async (req, res, next) => {
  try {
    const module = await courseService.createModule(req.body ?? {});
    res.status(201).json(module);
  } catch (error) {
    next(error);
  }
});

courseRouter.patch('/modules/:id', async (req, res, next) => {
  try {
    const module = await courseService.updateModule(req.params.id, req.body ?? {});
    res.json(module);
  } catch (error) {
    next(error);
  }
});

courseRouter.post('/progress', async (req, res, next) => {
  try {
    const progress = await courseService.updateProgress(req.body ?? {});
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

courseRouter.get('/:id/progress', async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (typeof userId !== 'string') {
      res.status(400).json({ error: 'userId query param is required' });
      return;
    }
    const progress = await courseService.getUserProgress(userId, req.params.id);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

courseRouter.post('/:id/enroll', async (req, res, next) => {
  try {
    const { userId } = req.body ?? {};
    if (typeof userId !== 'string') {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    const enrollment = await courseService.enrollInCourse(userId, req.params.id);
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
});

courseRouter.get('/user/:userId/enrollments', async (req, res, next) => {
  try {
    const enrollments = await courseService.getUserEnrollments(req.params.userId);
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
});

courseRouter.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File is required' });
      return;
    }
    const url = await courseService.uploadFile(req.file, req.body.folder);
    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

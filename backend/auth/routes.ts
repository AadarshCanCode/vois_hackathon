import { Router, Request, Response } from 'express';
import { authService } from '../auth/authService.js';
import { LoginCredentials, RegisterData } from '../auth/types.js';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const credentials: LoginCredentials = req.body;
    const user = await authService.login(credentials);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Login failed' 
    });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const userData: RegisterData = req.body;
    const user = await authService.register(userData);
    if (!user) {
      return res.status(400).json({ error: 'Registration failed' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Registration failed' 
    });
  }
});

router.post('/logout', async (_req: Request, res: Response) => {
  try {
    await authService.logout();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Logout failed' 
    });
  }
});

router.get('/me', async (_req: Request, res: Response) => {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get user' 
    });
  }
});

router.get('/check-role/:role', async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const hasRole = await authService.hasRole(role);
    res.json({ hasRole });
  } catch (error) {
    console.error('Role check error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Role check failed' 
    });
  }
});

export default router;
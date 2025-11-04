import { Router, Request, Response } from 'express';
import { getQuestionsByCompany, getQuestionsByDifficulty, getQuestionsByCategory, getRandomTechnicalQuestions } from '../data/technicalQuestions.js';
import { getLabsByDifficulty, getLabById, getRandomLabs } from '../data/labs.js';

const router = Router();

// Technical Questions endpoints
router.get('/technical-questions', (req: Request, res: Response) => {
  try {
    const { company, difficulty, category, count } = req.query;
    let questions;
    
    if (company && typeof company === 'string') {
      questions = getQuestionsByCompany(company);
    } else if (difficulty && typeof difficulty === 'string') {
      questions = getQuestionsByDifficulty(difficulty as 'junior' | 'mid' | 'senior' | 'principal');
    } else if (category && typeof category === 'string') {
      questions = getQuestionsByCategory(category);
    } else if (count && typeof count === 'string') {
      questions = getRandomTechnicalQuestions(parseInt(count));
    } else {
      questions = getRandomTechnicalQuestions(5);
    }
    
    res.json({ questions });
  } catch (error) {
    console.error('Get technical questions error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get technical questions' 
    });
  }
});

// Labs endpoints
router.get('/labs', (req: Request, res: Response) => {
  try {
    const { difficulty, count } = req.query;
    let labsList;
    
    if (difficulty && typeof difficulty === 'string') {
      labsList = getLabsByDifficulty(difficulty as 'beginner' | 'intermediate' | 'advanced');
    } else if (count && typeof count === 'string') {
      labsList = getRandomLabs(parseInt(count));
    } else {
      labsList = getRandomLabs(3);
    }
    
    res.json({ labs: labsList });
  } catch (error) {
    console.error('Get labs error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get labs' 
    });
  }
});

router.get('/labs/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lab = getLabById(id);
    
    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    
    res.json({ lab });
  } catch (error) {
    console.error('Get lab error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get lab' 
    });
  }
});

export default router;
import { Router, Request, Response } from 'express';
import { assessmentService } from './assessmentService.js';
import { getQuestionsByDifficulty, getRandomQuestions, getQuestionById } from './data/questions.js';
import { AssessmentAnswerInput } from './types.js';

const router = Router();

// Get questions
router.get('/questions', (req: Request, res: Response) => {
  try {
    const { difficulty, count } = req.query;
    let questions;
    
    if (difficulty && typeof difficulty === 'string') {
      questions = getQuestionsByDifficulty(difficulty as 'easy' | 'medium' | 'hard');
    } else if (count && typeof count === 'string') {
      questions = getRandomQuestions(parseInt(count));
    } else {
      questions = getRandomQuestions(5);
    }
    
    res.json({ questions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get questions' 
    });
  }
});

// Get specific question
router.get('/questions/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = getQuestionById(id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ question });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get question' 
    });
  }
});

// Start assessment attempt
router.post('/attempts', async (req: Request, res: Response) => {
  try {
    const { userId, context } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const attempt = await assessmentService.startAttempt(userId, context);
    res.json({ attempt });
  } catch (error) {
    console.error('Start attempt error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to start attempt' 
    });
  }
});

// Submit answer
router.post('/answers', async (req: Request, res: Response) => {
  try {
    const answer: AssessmentAnswerInput = req.body;
    
    if (!answer.user_id || !answer.question_id) {
      return res.status(400).json({ error: 'user_id and question_id are required' });
    }
    
    const success = await assessmentService.submitAnswer(answer);
    res.json({ success });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to submit answer' 
    });
  }
});

// Get attempt results
router.get('/attempts/:attemptId/results', async (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const results = await assessmentService.getAttemptResults(attemptId);
    res.json({ results });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get results' 
    });
  }
});

// Get attempt score
router.get('/attempts/:attemptId/score', async (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const score = await assessmentService.calculateScore(attemptId);
    res.json({ score });
  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to calculate score' 
    });
  }
});

// Get user assessments
router.get('/users/:userId/attempts', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const attempts = await assessmentService.getUserAssessments(userId);
    res.json({ attempts });
  } catch (error) {
    console.error('Get user assessments error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get user assessments' 
    });
  }
});

export default router;
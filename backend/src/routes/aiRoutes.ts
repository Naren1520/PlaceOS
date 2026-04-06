import express from 'express';
import { analyzeStudent } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/analyze-student', protect, analyzeStudent);

export default router;
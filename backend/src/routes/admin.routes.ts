import { Router } from 'express';
import { authMiddleware } from '../middleware/adminAuth';
import { getApiPerformance } from '../controllers/performance.controller';
import { getAllCodes } from '../controllers/staff.controller';

const router = Router();

// Route for admins to view API performance metrics
router.get('/performance', authMiddleware, getApiPerformance);
router.get('/codes', authMiddleware, getAllCodes);

export default router;

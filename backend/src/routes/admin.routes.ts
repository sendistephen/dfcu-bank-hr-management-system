import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { getApiPerformance } from '../controllers/performance.controller';

const router = Router();

// Route for admins to view API performance metrics
router.get('/performance', adminAuth, getApiPerformance);

export default router;

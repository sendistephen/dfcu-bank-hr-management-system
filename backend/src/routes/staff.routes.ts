import express from 'express';
import { generateStaffCode, getStaff, registerStaff, updateStaff } from '../controllers/staff.controller';

import upload from '../middleware/upload';
import { authMiddleware } from '../middleware/adminAuth';
import { verifyToken } from '../middleware/jwt';

const router = express.Router();

// Only admins can generate a staff code
router.post('/create-code', authMiddleware, generateStaffCode);
// Staff can register using a valid code
router.post('/register', upload.single('photoId'), registerStaff);
// Get all or a specific staff member
router.get('/', verifyToken, getStaff);
// Update staff details
router.patch('/update/:employeeNumber', verifyToken, upload.single('photoId'), updateStaff);

export default router;

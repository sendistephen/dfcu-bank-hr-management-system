import 'tsconfig-paths/register';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import errorHandler from './middleware/errorHandler';
import { logApiPerformance } from './middleware/performanceTracker';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import staffRoutes from './routes/staff.routes';
import prisma from './utils/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8900;

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://dfcu-bank-hr-management-system.vercel.app'],
  })
);

app.use(helmet());

app.use(express.json());
app.use(cookieParser());

// Middleware for logging API performance
app.use(logApiPerformance);

app.get('/api', (req, res) => {
  res.json({
    message:
      'Welcome to the Staff Management API! This API is designed to help you manage your staff members. Please use the documentation provided to learn more about the available endpoints and how to use them.',
  });
});

app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/staff', staffRoutes); // Staff management routes
app.use('/api/admin', adminRoutes); // Admin-specific routes

// Custom error handler middleware for handling errors across the app
app.use(errorHandler);

// Check the database connection when server starts
const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database URL:', process.env.DATABASE_URL);

    console.log('Connected to database');
  } catch (error) {
    console.error('Failed to connect to database', error);
    process.exit(1);
  }
};

// Start the server once the database connection is established
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

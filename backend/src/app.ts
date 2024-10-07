import 'tsconfig-paths/register';
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

// const setupSwaggerDocs = require('./swagger/swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8900;

app.use(helmet());

app.use(express.json());
app.use(cookieParser());

// Configure Swagger
// setupSwaggerDocs(app);

app.use(logApiPerformance);

// Routes
app.get('/api', (req, res) => {
  res.json({
    message:
      'Welcome to the Staff Management API! This API is designed to help you manage your staff members. Please use the documentation provided to learn more about the available endpoints and how to use them.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);

// middleware
app.use(errorHandler);

// check db connection when server starts
const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (error) {
    console.log('Failed to connect to database', error);
    process.exit(1);
  }
};

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

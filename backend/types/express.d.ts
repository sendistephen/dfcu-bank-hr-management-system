import express from 'express';

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export interface CustomRequest extends express.Request {
  userId?: number;
  userRole?: string;
}

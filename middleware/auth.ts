import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // If no token, use a default guest user ID (valid MongoDB ObjectId)
  if (!token) {
    (req as any).userId = '60d5f5f5f5f5f5f5f5f5f5f5';
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    // On error, still allow as guest
    (req as any).userId = '60d5f5f5f5f5f5f5f5f5f5f5';
    next();
  }
};

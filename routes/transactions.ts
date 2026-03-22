import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// Get all transactions for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: (req as any).userId }).sort({ transactionDate: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

export default router;

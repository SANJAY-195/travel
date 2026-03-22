import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { Booking } from '../models/Booking';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// Get all bookings for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: (req as any).userId }).sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get a specific booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: (req as any).userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Create a new booking (initial state: Unpaid)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, details, amount } = req.body;
    const booking = new Booking({
      userId: (req as any).userId,
      type,
      details,
      amount,
      status: 'Pending',
      paymentStatus: 'Unpaid'
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Confirm booking after payment
router.post('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const { paymentMethod, amount } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, userId: (req as any).userId });
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Update booking status
    booking.status = 'Confirmed';
    booking.paymentStatus = 'Paid';
    await booking.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: (req as any).userId,
      bookingId: booking._id,
      amount: amount || booking.amount,
      paymentMethod,
      status: 'Success'
    });
    await transaction.save();

    res.json({ message: 'Booking confirmed', booking, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming booking' });
  }
});

export default router;

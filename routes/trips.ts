import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { Trip } from '../models/Trip';
import { Booking } from '../models/Booking';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: (req as any).userId });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const trip = new Trip({
      ...req.body,
      userId: (req as any).userId,
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error creating trip' });
  }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const trips = await Trip.find({ userId });
    const bookings = await Booking.find({ userId });
    
    const tripSpent = trips.reduce((acc, trip) => {
      const spent = trip.expenses.reduce((tAcc, exp) => tAcc + (exp.amount || 0), 0);
      return acc + spent;
    }, 0);

    const bookingSpent = bookings.reduce((acc, booking) => {
      return acc + (booking.amount || 0);
    }, 0);

    const totalSpent = tripSpent + bookingSpent;

    res.json({
      tripsCount: trips.length,
      bookingsCount: bookings.length,
      totalSpent,
      recentBookings: bookings.sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime()).slice(0, 5),
      upcomingTrips: trips.filter(t => new Date(t.startDate) > new Date()).slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

export default router;

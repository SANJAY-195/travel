import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { Booking } from '../models/Booking';

const router = express.Router();

// Mock flight search
router.get('/search', async (req, res) => {
  const { from, to, date } = req.query;
  
  const getAirlines = (dest: string) => {
    const d = (dest || '').toLowerCase();
    if (d.includes('dubai')) return ['Emirates', 'FlyDubai', 'Qatar Airways'];
    if (d.includes('london')) return ['British Airways', 'Virgin Atlantic', 'Lufthansa'];
    if (d.includes('delhi') || d.includes('mumbai') || d.includes('india')) return ['Air India', 'IndiGo', 'Vistara'];
    if (d.includes('paris')) return ['Air France', 'Lufthansa', 'British Airways'];
    if (d.includes('new york')) return ['Delta Air Lines', 'United Airlines', 'American Airlines'];
    if (d.includes('singapore')) return ['Singapore Airlines', 'Scoot', 'AirAsia'];
    if (d.includes('tokyo')) return ['Japan Airlines', 'ANA', 'Peach Aviation'];
    if (d.includes('berlin') || d.includes('frankfurt')) return ['Lufthansa', 'Eurowings', 'Condor'];
    return ['Global Wings', 'SkyHigh Air', 'Oceanic Jet'];
  };

  const airlines = getAirlines(to as string);
  
  // Mock data
  const flights = [
    { id: '1', airline: airlines[0], from, to, departure: '10:00 AM', arrival: '12:30 PM', duration: '2h 30m', price: 25000, stops: 0 },
    { id: '2', airline: airlines[1], from, to, departure: '02:00 PM', arrival: '05:45 PM', duration: '3h 45m', price: 18000, stops: 1 },
    { id: '3', airline: airlines[2], from, to, departure: '08:00 PM', arrival: '11:00 PM', duration: '3h 00m', price: 32000, stops: 0 },
    { id: '4', airline: airlines[0], from, to, departure: '06:30 AM', arrival: '09:00 AM', duration: '2h 30m', price: 22000, stops: 0 },
    { id: '5', airline: airlines[1], from, to, departure: '11:15 AM', arrival: '03:30 PM', duration: '4h 15m', price: 15500, stops: 1 },
    { id: '6', airline: airlines[2], from, to, departure: '04:45 PM', arrival: '07:45 PM', duration: '3h 00m', price: 28000, stops: 0 },
    { id: '7', airline: airlines[0], from, to, departure: '09:30 PM', arrival: '12:00 AM', duration: '2h 30m', price: 21000, stops: 0 },
    { id: '8', airline: airlines[1], from, to, departure: '01:00 AM', arrival: '05:30 AM', duration: '4h 30m', price: 14000, stops: 1 },
    { id: '9', airline: airlines[2], from, to, departure: '07:15 AM', arrival: '10:15 AM', duration: '3h 00m', price: 35000, stops: 0 },
    { id: '10', airline: airlines[0], from, to, departure: '12:45 PM', arrival: '03:15 PM', duration: '2h 30m', price: 26500, stops: 0 },
    { id: '11', airline: airlines[1], from, to, departure: '05:30 PM', arrival: '09:45 PM', duration: '4h 15m', price: 19500, stops: 1 },
    { id: '12', airline: airlines[2], from, to, departure: '11:00 PM', arrival: '02:00 AM', duration: '3h 00m', price: 29000, stops: 0 },
  ];

  res.json(flights);
});

router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { flightDetails } = req.body;
    const booking = new Booking({
      userId: (req as any).userId,
      type: 'Flight',
      details: flightDetails,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error booking flight' });
  }
});

export default router;

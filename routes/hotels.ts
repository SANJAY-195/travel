import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { Booking } from '../models/Booking';

const router = express.Router();

// Mock hotel search
router.get('/search', async (req, res) => {
  const { city } = req.query;
  
  // Mock data
  const hotels = [
    { id: '1', name: 'Grand Palace', city, price: 15000, roomType: 'Deluxe King Room', rating: 4.5, amenities: ['Pool', 'WiFi', 'Spa'], image: 'https://picsum.photos/seed/palace/400/300' },
    { id: '2', name: 'Urban Stay', city, price: 8500, roomType: 'Standard Queen Room', rating: 4.0, amenities: ['WiFi', 'Gym'], image: 'https://picsum.photos/seed/urban/400/300' },
    { id: '3', name: 'Luxury Resort', city, price: 30000, roomType: 'Ocean View Suite', rating: 5.0, amenities: ['Pool', 'Beach', 'All-Inclusive'], image: 'https://picsum.photos/seed/resort/400/300' },
    { id: '4', name: 'The Heritage', city, price: 12000, roomType: 'Classic Suite', rating: 4.2, amenities: ['WiFi', 'Breakfast', 'Parking'], image: 'https://picsum.photos/seed/heritage/400/300' },
    { id: '5', name: 'Skyline View', city, price: 18000, roomType: 'Executive Room', rating: 4.7, amenities: ['Rooftop Bar', 'WiFi', 'Gym'], image: 'https://picsum.photos/seed/skyline/400/300' },
    { id: '6', name: 'Riverside Inn', city, price: 9500, roomType: 'River View Room', rating: 3.8, amenities: ['WiFi', 'Restaurant'], image: 'https://picsum.photos/seed/river/400/300' },
    { id: '7', name: 'Boutique Garden', city, price: 11000, roomType: 'Garden View Room', rating: 4.3, amenities: ['WiFi', 'Garden', 'Cafe'], image: 'https://picsum.photos/seed/garden/400/300' },
    { id: '8', name: 'The Continental', city, price: 22000, roomType: 'Premium Suite', rating: 4.9, amenities: ['Pool', 'WiFi', 'Concierge'], image: 'https://picsum.photos/seed/continental/400/300' },
    { id: '9', name: 'Budget Lodge', city, price: 4500, roomType: 'Economy Double', rating: 3.5, amenities: ['WiFi', 'Parking'], image: 'https://picsum.photos/seed/lodge/400/300' },
    { id: '10', name: 'Seaside Manor', city, price: 25000, roomType: 'Beachfront Villa', rating: 4.8, amenities: ['Private Beach', 'WiFi', 'Pool'], image: 'https://picsum.photos/seed/seaside/400/300' },
    { id: '11', name: 'Mountain Retreat', city, price: 14000, roomType: 'Mountain View Cabin', rating: 4.6, amenities: ['WiFi', 'Hiking Trails', 'Fireplace'], image: 'https://picsum.photos/seed/mountain/400/300' },
    { id: '12', name: 'City Center Hotel', city, price: 13500, roomType: 'Superior Room', rating: 4.1, amenities: ['WiFi', 'Business Center'], image: 'https://picsum.photos/seed/city/400/300' },
    { id: '13', name: 'The Plaza', city, price: 28000, roomType: 'Presidential Suite', rating: 5.0, amenities: ['Pool', 'WiFi', 'Spa', 'Butler'], image: 'https://picsum.photos/seed/plaza/400/300' },
    { id: '14', name: 'Cozy Corner', city, price: 6000, roomType: 'Single Room', rating: 3.9, amenities: ['WiFi', 'Breakfast'], image: 'https://picsum.photos/seed/cozy/400/300' },
    { id: '15', name: 'Royal Residency', city, price: 16500, roomType: 'King Suite', rating: 4.4, amenities: ['WiFi', 'Gym', 'Restaurant'], image: 'https://picsum.photos/seed/royal/400/300' },
  ];

  res.json(hotels);
});

router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { hotelDetails } = req.body;
    const booking = new Booking({
      userId: (req as any).userId,
      type: 'Hotel',
      details: hotelDetails,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error booking hotel' });
  }
});

export default router;

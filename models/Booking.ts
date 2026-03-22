import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Flight', 'Hotel', 'Activity'], required: true },
  details: { type: mongoose.Schema.Types.Mixed, required: true },
  amount: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid', 'Refunded'], default: 'Unpaid' },
});

export const Booking = mongoose.model('Booking', bookingSchema);

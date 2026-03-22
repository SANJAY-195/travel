import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  travelHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);

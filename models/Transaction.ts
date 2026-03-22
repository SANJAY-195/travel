import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Card', 'UPI', 'NetBanking'], required: true },
  status: { type: String, enum: ['Success', 'Failure'], default: 'Success' },
  transactionDate: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);

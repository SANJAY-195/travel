import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  itinerary: [{
    day: Number,
    activities: [{
      time: String,
      activity: String,
      cost: Number,
      notes: String
    }]
  }],
  expenses: [{
    category: { type: String, enum: ['Flight', 'Hotel', 'Activity', 'Misc'] },
    amount: Number,
    description: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

export const Trip = mongoose.model('Trip', tripSchema);

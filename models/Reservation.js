const mongoose = require('mongoose');

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  trainNumber: { type: String, required: true },
  coachType: {
    type: String,
    required: true,
    enum: ['SL', '3A', '2A', 'FC', 'General']
  },
  fromStation: { type: String, required: true },
  toStation: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Consider changing to Date if precise time is needed
  berth: { type: String },
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔐 Pre-save hook to generate a unique 6-digit PNR if not provided
reservationSchema.pre('validate', function (next) {
  if (!this.pnr) {
    this.pnr = Math.floor(100000 + Math.random() * 900000).toString();
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);

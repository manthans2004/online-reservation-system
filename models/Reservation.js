const mongoose = require('mongoose');

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
    time: { type: String, required: true },
    berth: { type: String },
    notes: { type: String },
    status: { 
        type: String, 
        default: 'confirmed',
        enum: ['pending', 'confirmed', 'cancelled']
    },
    pnr: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Generate PNR before saving
reservationSchema.pre('save', function(next) {
    if (!this.pnr) {
        this.pnr = Math.floor(100000 + Math.random() * 900000).toString();
    }
    next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
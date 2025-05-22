const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Create a reservation
router.post('/', async (req, res) => {
    try {
        const coachTypeMap = {
            'Sleeper Class (SL)': 'SL',
            'AC 3-Tier (3A)': '3A',
            'AC 2-Tier (2A)': '2A',
            'First Class (FC)': 'FC'
        };

        const reservationData = {
            ...req.body,
            coachType: coachTypeMap[req.body.coachType] || req.body.coachType
        };

        const reservation = new Reservation(reservationData);
        await reservation.save();
        
        res.status(201).json({
            success: true,
            data: reservation,
            pnr: reservation.pnr,
            message: 'Ticket booked successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1 });
        res.json({
            success: true,
            data: reservations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Get available trains
router.get('/trains', async (req, res) => {
    try {
        const trains = [
            { number: "12001", name: "Shatabdi Express", from: "Delhi", to: "Bhopal", classes: ["3A", "2A"] },
            { number: "12951", name: "Mumbai Rajdhani", from: "Mumbai", to: "Delhi", classes: ["3A", "2A", "FC"] },
            { number: "12627", name: "Karnataka Express", from: "New Delhi", to: "Bangalore", classes: ["SL", "3A"] }
        ];
        
        res.json({
            success: true,
            data: trains
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Get availability
router.get('/availability/:trainNumber/:date', async (req, res) => {
    try {
        const { trainNumber, date } = req.params;
        const travelDate = new Date(date);
        
        const existingBookings = await Reservation.find({ 
            trainNumber,
            date: travelDate 
        });
        
        const availability = {
            times: ["06:00 AM", "09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"],
            berths: ["A1-01", "A1-02", "A1-03", "B1-04", "B1-05"]
        };
        
        res.json({
            success: true,
            data: availability
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;
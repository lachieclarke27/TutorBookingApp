const Booking = require('../models/Booking');
const TutorAvailability = require('../models/TutorAvailability');

// Create a new booking
const createBooking = async (req, res) => {
    try {
        // Only students can create bookings
        if (req.user.role !== 'student') {
            return res.status(403).json({
                message: 'Only students can create bookings'
            });
        }

        const { availabilityId } = req.body;

        // Check availability ID
        if (!availabilityId || !require('mongoose').isValidObjectId(availabilityId)) {
            return res.status(400).json({
                message: 'Please provide a valid availability slot'
            });
        }

        // Find the selected availability
        const availability = await TutorAvailability.findById(availabilityId);

        if (!availability) {
            return res.status(404).json({
                message: 'Availability slot not found'
            });
        }

        // Prevent students from booking their own availability
        if (availability.tutor.toString() === req.user._id.toString()) {
            return res.status(403).json({
                message: 'You cannot book your own availability'
            });
        }

        // Check that the availability belongs to a tutor
        const User = require('../models/User');
        const tutor = await User.findById(availability.tutor);

        if (!tutor || tutor.role !== 'tutor') {
            return res.status(400).json({
                message: 'This availability does not belong to a valid tutor'
            });
        }

        // Prevent booking past dates and times
        const now = new Date();

        const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Australia/Brisbane'
        }).format(now);

        const currentTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Australia/Brisbane',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(now);

        if (
            availability.date < today ||
            (availability.date === today && availability.startTime <= currentTime)
        ) {
            return res.status(400).json({
                message: 'This availability slot has already passed'
            });
        }

        // Check whether the slot has already been booked
        const existingBooking = await Booking.findOne({
            availability: availabilityId
        });

        if (existingBooking) {
            return res.status(400).json({
                message: 'This availability slot has already been booked'
            });
        }

        // Create the booking
        const booking = await Booking.create({
            student: req.user._id,
            tutor: availability.tutor,
            availability: availability._id
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });

    } catch (error) {
        // Handle duplicate booking attempts
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'This availability slot has already been booked'
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
createBooking
};
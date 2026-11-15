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

    if (!availabilityId) {
        return res.status(400).json({
            message: 'Please select an availability slot'
        });
    }

    // Find the selected availability
    const availability = await TutorAvailability.findById(availabilityId);

    if (!availability) {
        return res.status(404).json({
            message: 'Availability slot not found'
        });
    }

    // Prevent booking past availability
    const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Australia/Brisbane'
    }).format(new Date());

    if (availability.date < today) {
        return res.status(400).json({
            message: 'Cannot book a past availability slot'
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
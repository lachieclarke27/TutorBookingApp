const express = require('express');

const {
createBooking,
getMyBookings,
cancelBooking
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a booking (students only)
router.post('/', protect, createBooking);

// Retrieve bookings belonging to the logged-in student
router.get('/my-bookings', protect, getMyBookings);

// Cancel a booking
router.delete('/:bookingId', protect, cancelBooking);


module.exports = router;
const express = require('express');

const {
createBooking,
getMyBookings,
cancelBooking,
getTutorBookings, 
approveBooking,
declineBooking
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a booking (students only)
router.post('/', protect, createBooking);

// Retrieve bookings belonging to the logged-in student
router.get('/my-bookings', protect, getMyBookings);

// Cancel a booking
router.delete('/:bookingId', protect, cancelBooking);

// Retrieve bookings belonging to the logged-in tutor
router.get('/tutor-bookings', protect, getTutorBookings);

// Approve a booking
router.put('/:bookingId/approve', protect, approveBooking);

// Decline a booking
router.put('/:bookingId/decline', protect, declineBooking);


module.exports = router;
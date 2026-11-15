const express = require('express');

const {
createBooking
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a booking (students only)
router.post('/', protect, createBooking);


module.exports = router;
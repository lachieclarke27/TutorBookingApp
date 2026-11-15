const express = require('express');

const {
    createAvailability,
    getMyAvailability,
    getTutorAvailability
} = require('../controllers/tutorAvailabilityController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create availability
router.post('/', protect, createAvailability);

// Get logged-in tutor's availability
router.get('/', protect, getMyAvailability);

// Get availability for a specific tutor
router.get('/tutor/:tutorId', protect, getTutorAvailability);

module.exports = router;
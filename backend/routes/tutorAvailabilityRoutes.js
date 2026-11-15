const express = require('express');

const {
    createAvailability,
    getMyAvailability,
    getTutorAvailability, 
    updateAvailability,
    deleteAvailability
} = require('../controllers/tutorAvailabilityController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create availability
router.post('/', protect, createAvailability);

// Get logged-in tutor's availability
router.get('/', protect, getMyAvailability);

// Get availability for a specific tutor
router.get('/tutor/:tutorId', protect, getTutorAvailability);

// Update availability
router.put('/:availabilityId', protect, updateAvailability);

// Delete availability
router.delete('/:availabilityId', protect, deleteAvailability);

module.exports = router;
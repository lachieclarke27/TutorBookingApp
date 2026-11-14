const express = require('express');
const {
    createTutorProfile,
    getTutorProfile,
    updateTutorProfile,
    getAllTutorProfiles
} = require('../controllers/tutorProfileController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Tutor profile routes
router.post('/', protect, createTutorProfile);
router.get('/', protect, getTutorProfile);
router.get('/all', protect, getAllTutorProfiles);
router.put('/', protect, updateTutorProfile);

module.exports = router;
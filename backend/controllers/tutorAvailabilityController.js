const mongoose = require('mongoose');
const TutorAvailability = require('../models/TutorAvailability');

// Create a tutor availability slot
const createAvailability = async (req, res) => {
    try {
        // Only tutors can create availability
        if (req.user.role !== 'tutor') {
            return res.status(403).json({
                message: 'Only tutors can add availability'
            });
        }

        const { date, startTime, endTime } = req.body;

        // Check required fields
        if (!date || !startTime || !endTime) {
            return res.status(400).json({
                message: 'Please provide a date, start time and end time'
            });
        }

        // Create availability associated with logged-in tutor
        const availability = await TutorAvailability.create({
            tutor: req.user._id,
            date,
            startTime,
            endTime
        });

        res.status(201).json({
            message: 'Availability created successfully',
            availability
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Get availability for logged-in tutor
const getMyAvailability = async (req, res) => {
    try {
        if (req.user.role !== 'tutor') {
            return res.status(403).json({
                message: 'Only tutors can view their own availability'
            });
        }

        const availability = await TutorAvailability.find({
            tutor: req.user._id
        }).sort({ date: 1, startTime: 1 });

        res.status(200).json({
            count: availability.length,
            availability
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get availability for a specific tutor
const getTutorAvailability = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!mongoose.isValidObjectId(tutorId)) {
            return res.status(400).json({
                message: 'Invalid tutor ID'
            });
        }

        const availability = await TutorAvailability.find({
            tutor: tutorId
        }).sort({ date: 1, startTime: 1 });

        res.status(200).json({
            count: availability.length,
            availability
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createAvailability,
    getMyAvailability,
    getTutorAvailability
};
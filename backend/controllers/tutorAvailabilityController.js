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

        // Validate date format and actual calendar date
        const dateParts = date.split('-');

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            dateParts.length !== 3 ||
            new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
        ) {
            return res.status(400).json({
                message: 'Please provide a valid date'
            });
        }

        // Prevent availability dates in the past
        const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Australia/Brisbane'
        }).format(new Date());

        if (date < today) {
            return res.status(400).json({
                message: 'Availability date cannot be in the past'
            });
        }

        // Validate time format
        const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({
                message: 'Please provide valid start and end times'
            });
        }

        // Ensure end time is later than start time
        if (endTime <= startTime) {
            return res.status(400).json({
                message: 'End time must be later than start time'
            });
        }

        // Check for overlapping availability
        const conflictingAvailability = await TutorAvailability.findOne({
            tutor: req.user._id,
            date,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (conflictingAvailability) {
            return res.status(400).json({
                message: 'This availability overlaps with an existing slot'
            });
        }

        // Create availability
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
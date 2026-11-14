const TutorProfile = require('../models/TutorProfile');
const User = require('../models/User');

// Create a tutor profile
const createTutorProfile = async (req, res) => {
    try {
        // Find the currently logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is a tutor
        if (user.role !== 'tutor') {
            return res.status(403).json({
                message: 'Only tutors can create tutor profiles'
            });
        }

        // Does the tutor already ha a profile
        const existingProfile = await TutorProfile.findOne({
            tutor: user._id
        });

        if (existingProfile) {
            return res.status(400).json({
                message: 'You already have a tutor profile'
            });
        }

        const { description, subjects, hourlyRate } = req.body;

        // Create the profile
        const tutorProfile = await TutorProfile.create({
            tutor: user._id,
            description,
            subjects,
            hourlyRate
        });

        res.status(201).json({
            message: 'Tutor profile created successfully',
            tutorProfile: {
                ...tutorProfile.toObject(),
                tutor: {
                    id: user._id,
                    name: user.name
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get the logged-in tutor's profile
const getTutorProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'tutor') {
            return res.status(403).json({
                message: 'Only tutors can access tutor profiles'
            });
        }

        const tutorProfile = await TutorProfile.findOne({
            tutor: user._id
        });

        if (!tutorProfile) {
            return res.status(404).json({
                message: 'Tutor profile not found'
            });
        }

        res.status(200).json({
            tutorProfile: {
                ...tutorProfile.toObject(),
                tutor: {
                    id: user._id,
                    name: user.name
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update the logged-in tutor's profile
const updateTutorProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'tutor') {
            return res.status(403).json({
                message: 'Only tutors can update tutor profiles'
            });
        }

        const tutorProfile = await TutorProfile.findOne({
            tutor: user._id
        });

        if (!tutorProfile) {
            return res.status(404).json({
                message: 'Tutor profile not found'
            });
        }

        const { description, subjects, hourlyRate } = req.body;

        // Update only the supplied fields
        if (description !== undefined) {
            tutorProfile.description = description;
        }

        if (subjects !== undefined) {
            tutorProfile.subjects = subjects;
        }

        if (hourlyRate !== undefined) {
            tutorProfile.hourlyRate = hourlyRate;
        }

        const updatedProfile = await tutorProfile.save();

        res.status(200).json({
            message: 'Tutor profile updated successfully',
            tutorProfile: {
                ...updatedProfile.toObject(),
                tutor: {
                    id: user._id,
                    name: user.name
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createTutorProfile,
    getTutorProfile,
    updateTutorProfile
};
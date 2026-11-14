const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
    // Link TutorProfile to the tutor's user account
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    subjects: {
        type: [{
            type: String,
            trim: true
        }],
        required: true,
        validate: {
            validator: function (subjects) {
                return subjects.length > 0;
            },
            message: 'At least one subject must be provided'
        }
    },

    hourlyRate: {
        type: Number,
        required: true,
        min: [0.01, 'Hourly rate must be greater than zero']
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
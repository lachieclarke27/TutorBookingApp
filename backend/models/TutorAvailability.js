const mongoose = require('mongoose');

const tutorAvailabilitySchema = new mongoose.Schema({
tutor: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
date: {
type: String,
required: true,
match: [/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date (YYYY-MM-DD)']
},
startTime: {
type: String,
required: true,
match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Please provide a valid start time']
},
endTime: {
type: String,
required: true,
match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Please provide a valid end time']
}
}, {
timestamps: true
});

// Ensures that the end time is later than the start time
tutorAvailabilitySchema.pre('validate', function () {
if (this.startTime && this.endTime && this.endTime <= this.startTime) {
this.invalidate('endTime', 'End time must be later than start time');
}
});

module.exports = mongoose.model('TutorAvailability', tutorAvailabilitySchema);
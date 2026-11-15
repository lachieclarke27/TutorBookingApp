const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
student: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
tutor: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
availability: {
type: mongoose.Schema.Types.ObjectId,
ref: 'TutorAvailability',
required: true,
},
status: {
type: String,
enum: ['pending', 'confirmed', 'cancelled'],
default: 'pending'
}
}, {
timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
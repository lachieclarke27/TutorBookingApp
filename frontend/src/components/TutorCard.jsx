import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TutorCard = ({ tutor }) => {
const { user } = useAuth();

const [availability, setAvailability] = useState([]);
const [loading, setLoading] = useState(true);
const [bookingId, setBookingId] = useState(null);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

// Retrieve this tutor's availability
useEffect(() => {
    const fetchAvailability = async () => {
        try {
            const response = await axiosInstance.get(
                `/api/tutor-availability/tutor/${tutor.tutor._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            setAvailability(response.data.availability);

        } catch (error) {
            console.error('Failed to retrieve tutor availability:', error);
        } finally {
            setLoading(false);
        }
    };

    if (user?.token && tutor.tutor?._id) {
        fetchAvailability();
    } else {
        setLoading(false);
    }
}, [tutor.tutor?._id, user?.token]);

// Book a timeslot
const handleBooking = async (slot) => {
    const confirmed = window.confirm(
        `Would you like to book this timeslot on ${slot.date} from ${slot.startTime} to ${slot.endTime}?`
    );

    if (!confirmed) {
        return;
    }

    setBookingId(slot._id);
    setError('');
    setSuccess('');

    try {
        await axiosInstance.post(
            '/api/bookings',
            {
                availabilityId: slot._id
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );

        setAvailability((previousAvailability) =>
            previousAvailability.filter(
                (item) => item._id !== slot._id
            )
        );

        setSuccess('Booking created successfully!');

    } catch (error) {
        setError(
            error.response?.data?.message ||
            'Failed to create booking.'
        );
    } finally {
        setBookingId(null);
    }
};

return (
    <div className="border rounded-lg p-5 shadow hover:shadow-lg transition">

        <h2 className="text-xl font-bold mb-2">
            {tutor.tutor?.name}
        </h2>

        <p className="text-gray-600 mb-3">
            {tutor.description}
        </p>

        <p className="mb-2">
            <strong>Subjects:</strong> {tutor.subjects.join(', ')}
        </p>

        <p className="mb-4">
            <strong>Hourly Rate:</strong> $
            {tutor.hourlyRate.toFixed(2)} / hour
        </p>

        {/* Tutor availability */}
        <div className="border-t pt-4">

            <h3 className="font-bold text-lg mb-3">
                Available Timeslots
            </h3>

            {loading ? (
                <p>Loading availability...</p>
            ) : availability.length === 0 ? (
                <p className="text-gray-500">
                    No availability currently listed.
                </p>
            ) : (
                <div className="space-y-2">

                    {availability.map((slot) => (
                        <div
                            key={slot._id}
                            className="bg-gray-100 p-3 rounded flex justify-between items-center gap-3"
                        >

                            <div>
                                <p className="font-semibold">
                                    {new Date(`${slot.date}T00:00:00`).toLocaleDateString('en-AU')}
                                </p>

                                <p className="text-gray-600">
                                    {slot.startTime} – {slot.endTime}
                                </p>
                            </div>

                            {user?.role === 'student' && (
                                <button
                                    onClick={() => handleBooking(slot)}
                                    disabled={bookingId === slot._id}
                                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                                >
                                    {bookingId === slot._id
                                        ? 'Booking...'
                                        : 'Book'}
                                </button>
                            )}

                        </div>
                    ))}

                </div>
            )}
        </div>

        {/* Booking feedback */}
        {error && (
            <p className="text-red-600 mt-4">{error}</p>
        )}

        {success && (
            <p className="text-green-600 mt-4">{success}</p>
        )}

    </div>
);

};

export default TutorCard;
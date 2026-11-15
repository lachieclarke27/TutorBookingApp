import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
const { user } = useAuth();

const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

// Retrieve student bookings
useEffect(() => {
    const fetchBookings = async () => {
        try {
            const response = await axiosInstance.get(
                '/api/bookings/my-bookings',
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            setBookings(response.data.bookings);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to retrieve bookings.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (user?.token) {
        fetchBookings();
    } else {
        setError('Please log in to view your bookings.');
        setLoading(false);
    }
}, [user]);

// Cancel a booking
const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
        'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) {
        return;
    }

    setError('');

    try {
        await axiosInstance.delete(
            `/api/bookings/${bookingId}`,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );

        // Update the booking status locally
        setBookings((previousBookings) =>
            previousBookings.map((booking) =>
                booking._id === bookingId
                    ? { ...booking, status: 'cancelled' }
                    : booking
            )
        );

    } catch (error) {
        setError(
            error.response?.data?.message ||
            'Failed to cancel booking.'
        );
    }
};

if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
}

return (
    <div className="container mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
            My Bookings
        </h1>

        {error && (
            <p className="text-red-600 mb-4">{error}</p>
        )}

        {bookings.length === 0 ? (
            <p className="text-gray-600">
                You haven't made any bookings yet.
            </p>
        ) : (
            <div className="space-y-4">

                {bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className="border rounded-lg p-5 shadow"
                    >

                        <h2 className="text-xl font-bold mb-2">
                            {booking.tutor?.name}
                        </h2>

                        <p>
                            <strong>Date:</strong>{' '}
                            {booking.availability?.date}
                        </p>

                        <p>
                            <strong>Time:</strong>{' '}
                            {booking.availability?.startTime} –{' '}
                            {booking.availability?.endTime}
                        </p>

                        <p className="mt-2">
                            <strong>Status:</strong>{' '}
                            <span className={`font-semibold capitalize ${
                                booking.status === 'confirmed'
                                    ? 'text-green-600'
                                    : booking.status === 'pending'
                                        ? 'text-yellow-600'
                                        : booking.status === 'declined'
                                            ? 'text-red-600'
                                            : 'text-gray-500'
                            }`}> {booking.status}
                            </span>
                        </p>
                        {['pending', 'confirmed'].includes(booking.status) && (
                        <button
                            onClick={() => handleCancel(booking._id)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Cancel Booking
                        </button>
                        )}
                    </div>
                ))}

            </div>
        )}

    </div>
);

};

export default MyBookings;
import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TutorAvailability = () => {
    const { user } = useAuth();

    const [availability, setAvailability] = useState([]);
const [date, setDate] = useState('');
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');

const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

// Retrieve the logged-in tutor's availability
const fetchAvailability = async () => {
    try {
        const response = await axiosInstance.get(
            '/api/tutor-availability',
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );

        setAvailability(response.data.availability);

    } catch (error) {
        setError(
            error.response?.data?.message ||
            'Failed to retrieve availability.'
        );
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (user?.token) {
        fetchAvailability();
    } else {
        setError('You must be logged in to view availability.');
        setLoading(false);
    }
}, [user]);

// Submit a new availability slot
const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
        await axiosInstance.post(
            '/api/tutor-availability',
            {
                date,
                startTime,
                endTime
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );

        setSuccess('Availability added successfully!');

        // Clear form
        setDate('');
        setStartTime('');
        setEndTime('');

        // Refresh availability list
        await fetchAvailability();

    } catch (error) {
        setError(
            error.response?.data?.message ||
            'Failed to add availability.'
        );
    } finally {
        setSubmitting(false);
    }
};

if (loading) {
    return <p className="text-center mt-10">Loading availability...</p>;
}

return (
    <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
            Manage Your Availability
        </h1>

        {/* Availability submission form */}
        <section className="max-w-xl mb-10 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">
                Add Availability
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block font-semibold mb-1">
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        min={new Date().toLocaleDateString('en-CA')}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">
                        Start Time
                    </label>

                    <input
                        type="time"
                        value={startTime}
                        onChange={(event) => setStartTime(event.target.value)}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">
                        End Time
                    </label>

                    <input
                        type="time"
                        value={endTime}
                        onChange={(event) => setEndTime(event.target.value)}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                >
                    {submitting ? 'Saving...' : 'Add Availability'}
                </button>

            </form>

            {error && (
                <p className="text-red-600 mt-4">{error}</p>
            )}

            {success && (
                <p className="text-green-600 mt-4">{success}</p>
            )}
        </section>

        {/* Existing availability */}
        <section>
            <h2 className="text-2xl font-bold mb-4">
                Your Existing Availability
            </h2>

            {availability.length === 0 ? (
                <p>You haven't added any availability yet.</p>
            ) : (
                <div className="space-y-4">
                    {availability.map((slot) => (
                        <div
                            key={slot._id}
                            className="border rounded-lg p-5 shadow"
                        >
                            <h3 className="text-xl font-bold mb-2">
                                {slot.date}
                            </h3>

                            <p>
                                <strong>Start:</strong> {slot.startTime}
                            </p>

                            <p>
                                <strong>End:</strong> {slot.endTime}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </div>
);
};

export default TutorAvailability;
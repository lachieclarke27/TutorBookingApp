import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TutorAvailability = () => {
    const { user } = useAuth();

    const [availability, setAvailability] = useState([]);

    // New availability form
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Editing
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Retrieve tutor availability
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

    // Clear form
    const resetForm = () => {
        setDate('');
        setStartTime('');
        setEndTime('');
        setEditingId(null);
    };

    // Submit availability (create or update)
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const availabilityData = {
                date,
                startTime,
                endTime
            };

            if (editingId) {
                // Update existing availability
                await axiosInstance.put(
                    `/api/tutor-availability/${editingId}`,
                    availabilityData,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                );

                setSuccess('Availability updated successfully!');

            } else {
                // Create new availability
                await axiosInstance.post(
                    '/api/tutor-availability',
                    availabilityData,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                );

                setSuccess('Availability added successfully!');
            }

            resetForm();
            await fetchAvailability();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to save availability.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Load availability into the form for editing
    const handleEdit = (slot) => {
        setEditingId(slot._id);
        setDate(slot.date);
        setStartTime(slot.startTime);
        setEndTime(slot.endTime);

        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Delete availability
    const handleDelete = async (availabilityId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this availability slot?'
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await axiosInstance.delete(
                `/api/tutor-availability/${availabilityId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            setSuccess('Availability deleted successfully!');

            if (editingId === availabilityId) {
                resetForm();
            }

            await fetchAvailability();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to delete availability.'
            );
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

            {/* Availability form */}
            <section className="max-w-xl mb-10 p-6 border rounded-lg shadow">

                <h2 className="text-2xl font-bold mb-4">
                    {editingId ? 'Edit Availability' : 'Add Availability'}
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

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                        >
                            {submitting
                                ? 'Saving...'
                                : editingId
                                    ? 'Save Changes'
                                    : 'Add Availability'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </section>

            {/* Success and error messages */}
            {error && (
                <p className="text-red-600 mb-4">{error}</p>
            )}

            {success && (
                <p className="text-green-600 mb-4">{success}</p>
            )}

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
                                className="border rounded-lg p-5 shadow flex justify-between items-center"
                            >

                                <div>
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

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => handleEdit(slot)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(slot._id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
};

export default TutorAvailability;
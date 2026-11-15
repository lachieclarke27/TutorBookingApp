import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TutorAvailability = () => {
    const { user } = useAuth();

    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Retrieve the logged-in tutor's availability
    useEffect(() => {
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

        if (user?.token) {
            fetchAvailability();
        } else {
            setError('You must be logged in to view availability.');
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <p className="text-center mt-10">Loading availability...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-600">{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Manage Your Availability
            </h1>

            {availability.length === 0 ? (
                <p>You haven't added any availability yet.</p>
            ) : (
                <div className="space-y-4">
                    {availability.map((slot) => (
                        <div
                            key={slot._id}
                            className="border rounded-lg p-5 shadow"
                        >
                            <h2 className="text-xl font-bold mb-2">
                                {slot.date}
                            </h2>

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
        </div>
    );
};

export default TutorAvailability;
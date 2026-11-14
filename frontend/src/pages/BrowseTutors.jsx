import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const BrowseTutors = () => {
    const { user } = useAuth();

    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Retrieve all tutor profiles
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axiosInstance.get(
                    '/api/tutor-profile/all',
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                );

                setTutors(response.data.tutorProfiles);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to retrieve tutor profiles.'
                );
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchTutors();
        } else {
            setError('You must be logged in to browse tutors.');
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <p className="text-center mt-10">Loading tutors...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-600">{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Browse Tutors</h1>

            {tutors.length === 0 ? (
                <p>No tutor profiles are currently available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.map((tutor) => (
                        <div
                            key={tutor._id}
                            className="border rounded-lg p-5 shadow"
                        >
                            <h2 className="text-xl font-bold mb-2">
                                {tutor.tutor?.name}
                            </h2>

                            <p className="text-gray-600 mb-3">
                                {tutor.description}
                            </p>

                            <p className="mb-2">
                                <strong>Subjects:</strong>{' '}
                                {tutor.subjects.join(', ')}
                            </p>

                            <p>
                                <strong>Hourly Rate:</strong> $
                                {tutor.hourlyRate.toFixed(2)} / hour
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default BrowseTutors;
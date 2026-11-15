import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TutorCard = ({ tutor }) => {
    const { user } = useAuth();

    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);

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
                                className="bg-gray-100 p-3 rounded"
                            >
                                <p className="font-semibold">
                                    {new Date(`${slot.date}T00:00:00`).toLocaleDateString('en-AU')}
                                </p>

                                <p className="text-gray-600">
                                    {slot.startTime} – {slot.endTime}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default TutorCard;
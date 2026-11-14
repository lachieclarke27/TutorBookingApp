import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TutorProfile = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        description: '',
        subjects: '',
        hourlyRate: ''
    });

    const [profileExists, setProfileExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Retrieve existing tutor profile
    useEffect(() => {
        const fetchTutorProfile = async () => {
            try {
                const response = await axiosInstance.get('/api/tutor-profile');

                const profile = response.data.tutorProfile;

                setFormData({
                    description: profile.description,
                    subjects: profile.subjects.join(', '),
                    hourlyRate: profile.hourlyRate
                });

                setProfileExists(true);

            } catch (error) {
                if (error.response?.status !== 404) {
                    setMessage(
                        error.response?.data?.message ||
                        'Unable to load tutor profile.'
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTutorProfile();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Submit tutor profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const subjectsArray = formData.subjects
            .split(',')
            .map(subject => subject.trim())
            .filter(subject => subject.length > 0);

        const profileData = {
            description: formData.description,
            subjects: subjectsArray,
            hourlyRate: Number(formData.hourlyRate)
        };

        try {
            if (profileExists) {
                await axiosInstance.put('/api/tutor-profile', profileData);
                setMessage('Tutor profile updated successfully!');
            } else {
                await axiosInstance.post('/api/tutor-profile', profileData);
                setProfileExists(true);
                setMessage('Tutor profile created successfully!');
            }

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Unable to save tutor profile.'
            );
        }
    };

    if (loading) {
        return <p className="text-center mt-8">Loading tutor profile...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">

            <h1 className="text-3xl font-bold mb-6 text-center">
                Tutor Profile
            </h1>

            <form onSubmit={handleSubmit}>

                {/* Tutor Name */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">
                        Tutor Name
                    </label>

                    <input
                        type="text"
                        value={user?.name || ''}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Tell students about yourself and your tutoring experience..."
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Subjects */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">
                        Subjects
                    </label>

                    <input
                        type="text"
                        name="subjects"
                        value={formData.subjects}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Mathematics, Physics, Chemistry"
                        className="w-full p-2 border rounded"
                    />

                    <p className="text-sm text-gray-500 mt-1">
                        Separate multiple subjects with commas.
                    </p>
                </div>

                {/* Hourly Rate */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Hourly Rate ($)
                    </label>

                    <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="e.g. 45.00"
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                    {profileExists ? 'Update Profile' : 'Create Profile'}
                </button>

            </form>

            {/* Feedback Message */}
            {message && (
                <p className="mt-4 text-center font-semibold">
                    {message}
                </p>
            )}

        </div>
    );
};

export default TutorProfile;
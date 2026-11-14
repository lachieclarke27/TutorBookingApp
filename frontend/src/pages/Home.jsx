import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto p-6">

            {/* Welcome section */}
            <div className="text-center mt-10 mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to TutorLink
                </h1>

                <p className="text-lg text-gray-600">
                    Connect with tutors and find the support you need
                    to achieve your academic goals.
                </p>
            </div>

            {/* Logged-in user welcome */}
            {user ? (
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-semibold">
                        Hello, {user.name}!
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Welcome back to TutorLink.
                    </p>
                </div>
            ) : (
                <div className="text-center mb-10">
                    <p className="text-gray-600 mb-4">
                        Log in or register to get started.
                    </p>

                    <Link
                        to="/register"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Get Started
                    </Link>
                </div>
            )}

            {/* Tutor-specific section */}
            {user?.role === 'tutor' && (
                <section className="max-w-2xl mx-auto mt-8 p-6 bg-blue-50 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-3">
                        Your Tutor Profile
                    </h2>

                    <p className="text-gray-600 mb-4">
                        Create or update your tutor profile so students
                        can learn more about you, the subjects you teach,
                        and your hourly rate.
                    </p>

                    <Link
                        to="/tutor-profile"
                        className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                        Manage Tutor Profile
                    </Link>
                </section>
            )}

            {/* Student-specific section */}
            {user?.role === 'student' && (
                <section className="max-w-2xl mx-auto mt-8 p-6 bg-green-50 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-3">
                        Find a Tutor
                    </h2>

                    <p className="text-gray-600">
                        Welcome! You can use Tutor Booking to connect
                        with tutors and find academic support.
                    </p>
                </section>
            )}

        </div>
    );
};

export default Home;
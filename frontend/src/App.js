import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/my-account';
import TutorProfile from './pages/TutorProfile';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import BrowseTutors from './pages/BrowseTutors';
import TutorAvailability from './pages/TutorAvailability';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/" element={<Home/>} />
        <Route path="/browse-tutors" element={<BrowseTutors/>} />
        <Route path="/tutor-profile" element={
          <ProtectedRoute requiredRole="tutor">
            <TutorProfile />
        </ProtectedRoute>
        } />
        <Route path="/tutor-availability"element={
        <ProtectedRoute requiredRole="tutor">
            <TutorAvailability />
        </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
        <ProtectedRoute requiredRole="student">
            <MyBookings />
        </ProtectedRoute>
    }
/>
      </Routes>
    </Router>
  );
}

export default App;

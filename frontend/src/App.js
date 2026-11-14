import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/my-account';
import TutorProfile from './pages/TutorProfile';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/tutor-profile" element={
          <ProtectedRoute requiredRole="tutor">
            <TutorProfile />
        </ProtectedRoute>
          } />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;

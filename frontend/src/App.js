import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/my-account';
import Tasks from './pages/Tasks';
import TutorProfile from './pages//TutorProfile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tutor-profile" element={<TutorProfile/>} />
      </Routes>
    </Router>
  );
}

export default App;

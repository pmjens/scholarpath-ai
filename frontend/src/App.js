import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScholarshipSearch from './pages/ScholarshipSearch';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentProfile from './pages/StudentProfile';
import ApplicationTracker from './pages/ApplicationTracker';
import EssayAssistant from './pages/EssayAssistant';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<ScholarshipSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/applications" element={<ApplicationTracker />} />
            <Route path="/essay-assistant" element={<EssayAssistant />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

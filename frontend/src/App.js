import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScholarshipSearch from './pages/ScholarshipSearch';
import './styles.css';

function App()  {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<ScholarshipSearch />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Dashboard from './Components/Dashboard/Dashboard';
import Attendance from './Components/Attendance/Attendance';
import Students from './Components/Students/Students';
import Reports from './Components/Reports/Reports';
import Sidebar from './Components/Layout/Sidebar';
import ForgotPassword from './Components/Auth/ForgotPassword';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Clear any existing login session to start fresh
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    console.log('App started - Login page should be shown');
  }, []);

  const handleLogin = (status) => {
    console.log('Login status changed:', status);
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className="layout">
          <Sidebar onLogout={handleLogout} />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/students" element={<Students />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="*" element={<LoginSignup onLogin={handleLogin} />} />
        </Routes>
      )}
    </div>
  );
}

export default App;

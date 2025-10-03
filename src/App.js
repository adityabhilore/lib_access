
import React, { useState, useEffect } from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Dashboard from './Components/Dashboard/Dashboard';

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
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginSignup onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

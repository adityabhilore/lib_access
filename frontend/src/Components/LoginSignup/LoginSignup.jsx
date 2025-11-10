import React, { useState, useEffect } from 'react' 
import './LoginSignup.css'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import { Link } from 'react-router-dom'

const LoginSignup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('userData')
    if (savedData) {
      setFormData(JSON.parse(savedData))
      console.log('Data loaded from localStorage:', JSON.parse(savedData))
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Debug: Log the form data
    console.log('Form Data:', formData)
    
    // Simple authentication (in real app, this would be server-side)
    const validCredentials = {
      'admin@gcoerc.com': 'admin123',
      'staff@gcoerc.com': 'staff123'
    }
    
    console.log('Checking credentials:', formData.email, 'Password:', formData.password)
    console.log('Valid credentials:', validCredentials)
    
    if (validCredentials[formData.email] === formData.password) {
      // Store login session
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', formData.email)
      console.log('Login successful!')
      onLogin(true)
    } else {
      console.log('Login failed - credentials do not match')
      setError('Invalid email or password. Try: admin@library.com / admin123')
    }
  }

  return (
    <div className='container'>
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="email" />
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input">
            <img src={password_icon} alt="password" />
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>  
        </div>
        
        <div className="forgot-password">
          Lost password? <Link to="/forgot"><span>Click Here!</span></Link>
        </div>
        
        {/* <div className="credentials-help">
          <h4>Test Credentials:</h4>
          <p>Email: admin@library.com | Password: admin123</p>
          <p>Email: staff@library.com | Password: staff123</p>
        </div>
         */}
        <div className="submit-container">
          <button type="submit" className="btn primary">Login</button>
        </div>
      </form>
    </div>
  )
}


export default LoginSignup
import React, { useState, useEffect, useRef } from 'react' 
import './LoginSignup.css'
import { Link } from 'react-router-dom'
import { apiPost } from '../../api/client'

const LoginSignup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: 'Admin@gcoerc.com',
    password: 'Admin@123'
  })
  const [error, setError] = useState('')
  const SIMPLE = true

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    console.log('Form Data:', formData)
    
    // Simple authentication (in real app, this would be server-side)
    const validCredentials = {
      'admin@library.com': 'admin123',
      'staff@library.com': 'staff123'
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
    try {
      const res = await apiPost('/auth/login', { username: formData.email, password: formData.password })
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', res?.username || formData.email)
      localStorage.setItem('role', res?.role || 'admin')
      onLogin(true)
    } catch (err) {
      console.log('Login failed', err)
      setError('Invalid email or password')
    }
  }

  // particles animation
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.2 + Math.random() * 2.2,
      a: 0.2 + Math.random() * 0.6,
      vx: -0.2 + Math.random() * 0.4,
      vy: -0.2 + Math.random() * 0.4
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < -5) p.x = w + 5
        if (p.x > w + 5) p.x = -5
        if (p.y < -5) p.y = h + 5
        if (p.y > h + 5) p.y = -5
      }
      raf = requestAnimationFrame(draw)
    }
    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    draw()
    return () => {
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return SIMPLE ? (
    <div className="simple-login-page">
      <div className='container simple-card'>
        <div className="header">
          <div className="text">Smart Library Login</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="inputs">
            <div className="input">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 6.75A2.75 2.75 0 0 1 4.75 4h14.5A2.75 2.75 0 0 1 22 6.75v10.5A2.75 2.75 0 0 1 19.25 20H4.75A2.75 2.75 0 0 1 2 17.25V6.75Zm2.06-.75a.75.75 0 0 0-.56.24c-.14.15-.25.36-.25.51l.01.08L12 12.73l8.74-6.02a.75.75 0 0 0-.49-1.21l-.08-.01H4.06ZM20.5 8.72 12.4 14.33a1.75 1.75 0 0 1-1.96 0L2.5 8.72v8.53c0 .41.34.75.75.75h16.5c.41 0 .75-.34.75-.75V8.72Z"/></svg>
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 8V7a5 5 0 1 0-10 0v1H5.75A1.75 1.75 0 0 0 4 9.75v8.5C4 19.44 4.56 20 5.25 20h13.5c.69 0 1.25-.56 1.25-1.25v-8.5C20 9.56 19.44 9 18.75 9H17V8Zm-8.5-1a3.5 3.5 0 1 1 7 0v1h-7V7Zm3.5 5.25c.69 0 1.25.56 1.25 1.25v2a1.25 1.25 0 1 1-2.5 0v-2c0-.69.56-1.25 1.25-1.25Z"/></svg>
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="forgot-password">
            <Link to="/forgot"><span>Forgot Password?</span></Link>
          </div>
          <div className="submit-container">
            <button type="submit" className="btn primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div className="smart-login-page">
      <canvas ref={canvasRef} className="bg-particles"/>
      <div className="bg-gradient"/>
      <div className="blur-shape s1"/>
      <div className="blur-shape s2"/>
      <div className="blur-shape s3"/>
      <div className='container glass-card slide-in'>
        <div className="book-scene">
          <div className="book">
            <div className="cover"/>
            <div className="spine"/>
            <div className="pages">
              <span/>
              <span/>
              <span/>
            </div>
          </div>
        </div>
        <div className="header hover-underline">
          <div className="text">Smart Library Login</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="inputs">
            <div className="input">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 6.75A2.75 2.75 0 0 1 4.75 4h14.5A2.75 2.75 0 0 1 22 6.75v10.5A2.75 2.75 0 0 1 19.25 20H4.75A2.75 2.75 0 0 1 2 17.25V6.75Zm2.06-.75a.75.75 0 0 0-.56.24c-.14.15-.25.36-.25.51l.01.08L12 12.73l8.74-6.02a.75.75 0 0 0-.49-1.21l-.08-.01H4.06ZM20.5 8.72 12.4 14.33a1.75 1.75 0 0 1-1.96 0L2.5 8.72v8.53c0 .41.34.75.75.75h16.5c.41 0 .75-.34.75-.75V8.72Z"/></svg>
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 8V7a5 5 0 1 0-10 0v1H5.75A1.75 1.75 0 0 0 4 9.75v8.5C4 19.44 4.56 20 5.25 20h13.5c.69 0 1.25-.56 1.25-1.25v-8.5C20 9.56 19.44 9 18.75 9H17V8Zm-8.5-1a3.5 3.5 0 1 1 7 0v1h-7V7Zm3.5 5.25c.69 0 1.25.56 1.25 1.25v2a1.25 1.25 0 1 1-2.5 0v-2c0-.69.56-1.25 1.25-1.25Z"/></svg>
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="forgot-password">
            <Link to="/forgot"><span>Forgot Password?</span></Link>
          </div>
          <div className="submit-container">
            <button type="submit" className="btn primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}


export default LoginSignup
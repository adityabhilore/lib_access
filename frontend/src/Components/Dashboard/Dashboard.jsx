import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import { apiPost } from '../../api/client'

const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState({
    totalStudents: 0,
    attendancePercentage: 0,
    checkedInToday: 0,
    checkedOutToday: 0
  })

  const [scannedId, setScannedId] = useState('')
  const [recentScans, setRecentScans] = useState([])
  // Manual entry state (no barcode yet)
  const [dept] = useState('Computer')
  const [year, setYear] = useState('SY') // 2nd year
  const [division, setDivision] = useState('A')
  const [rollNo, setRollNo] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Simulate loading data on component mount
  useEffect(() => {
    // In real app, this would fetch from database
    console.log('Dashboard loaded')
  }, [])

  const submitManual = async (direction) => {
    if (!rollNo && !name) {
      alert('Enter Roll No or Name')
      return
    }
    setSubmitting(true)
    try {
      const body = { department: dept, year, division, roll_no: rollNo || null, name: name || null, direction }
      const res = await apiPost('/scan/manual', body)
      const idLabel = rollNo || name
      const scanData = { id: idLabel, timestamp: new Date().toLocaleString(), action: direction }
      setRecentScans(prev => [scanData, ...prev.slice(0, 9)])
      if (direction === 'IN') {
        setAttendanceData(prev => ({ ...prev, checkedInToday: prev.checkedInToday + 1 }))
      } else {
        setAttendanceData(prev => ({ ...prev, checkedOutToday: prev.checkedOutToday + 1 }))
      }
      // Clear only roll/name fields for quick next entry
      setRollNo(''); setName('')
      if (res?.message) console.log(res.message)
    } catch (e) {
      alert(e.message || 'Manual entry failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleScan = () => {
    if (scannedId.trim()) {
      const scanData = {
        id: scannedId,
        timestamp: new Date().toLocaleString(),
        action: 'Entry' // or 'Exit' based on logic
      }
      
      setRecentScans(prev => [scanData, ...prev.slice(0, 4)])
      setScannedId('')
      
      // Update attendance data
      setAttendanceData(prev => ({
        ...prev,
        checkedInToday: prev.checkedInToday + 1
      }))
      
      alert(`Student ID ${scannedId} scanned successfully!`)
    }
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Library Attendance System</h1>
          <p>GCOERC</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{attendanceData.totalStudents}</div>
            <div className="stat-label">Total Students</div>
            <div className="stat-link">More info →</div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">📊</div>
            <div className="stat-number">{attendanceData.attendancePercentage}%</div>
            <div className="stat-label">GCOERC Attendance Percentage</div>
            <div className="stat-link">More info →</div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">🕐</div>
            <div className="stat-number">{attendanceData.checkedInToday}</div>
            <div className="stat-label">Checked In Today</div>
            <div className="stat-link">More info →</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">🕐</div>
            <div className="stat-number">{attendanceData.checkedOutToday}</div>
            <div className="stat-label">Checked Out Today</div>
            <div className="stat-link">More info →</div>
          </div>
        </div>

        {/* Manual Entry (no barcode) */}
        <div className="scanner-section">
          <h3>Manual Entry (No Barcode)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(120px, 1fr))', gap: 10 }}>
            <div>
              <label>Department</label>
              <input value={dept} disabled />
            </div>
            <div>
              <label>Year</label>
              <select value={year} onChange={(e)=>setYear(e.target.value)}>
                <option value="SY">2nd (SY)</option>
                <option value="TY">3rd (TY)</option>
                <option value="Final">4th (Final)</option>
              </select>
            </div>
            <div>
              <label>Division</label>
              <select value={division} onChange={(e)=>setDivision(e.target.value)}>
                {['A','B','C'].map(d=> <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label>Roll No</label>
              <input value={rollNo} onChange={(e)=>setRollNo(e.target.value)} placeholder="e.g. LIB0123" />
            </div>
            <div>
              <label>Name (optional)</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Student Name" />
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
              <button disabled={submitting} onClick={()=>submitManual('IN')}>Mark IN</button>
              <button disabled={submitting} onClick={()=>submitManual('OUT')}>Mark OUT</button>
            </div>
          </div>
        </div>

        {/* Simple fallback: manual Student ID scanner retained for convenience */}
        <div className="scanner-section">
          <h3>Quick ID Input</h3>
          <div className="scanner-input">
            <input
              type="text"
              placeholder="Enter Student ID"
              value={scannedId}
              onChange={(e) => setScannedId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <button onClick={handleScan} className="scan-btn">Add</button>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="recent-scans">
          <h3>Recent Scans</h3>
          <div className="scans-list">
            {recentScans.length === 0 ? (
              <p>No recent scans</p>
            ) : (
              recentScans.map((scan, index) => (
                <div key={index} className="scan-item">
                  <span className="scan-id">ID: {scan.id}</span>
                  <span className="scan-time">{scan.timestamp}</span>
                  <span className="scan-action">{scan.action}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Report */}
        <div className="monthly-report">
          <h3>Monthly Attendance Report</h3>
          <div className="report-controls">
            <label>Select Year:</label>
            <select>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <p>📈 Chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

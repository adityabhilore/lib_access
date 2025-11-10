import React, { useState, useEffect } from 'react'
import './Dashboard.css'

const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState({
    totalStudents: 0,
    attendancePercentage: 0,
    checkedInToday: 0,
    checkedOutToday: 0
  })

  const [scannedId, setScannedId] = useState('')
  const [recentScans, setRecentScans] = useState([])

  // Simulate loading data on component mount
  useEffect(() => {
    // In real app, this would fetch from database
    console.log('Dashboard loaded')
  }, [])

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

        {/* Barcode Scanner Section */}
        <div className="scanner-section">
          <h3>Student ID Scanner</h3>
          <div className="scanner-input">
            <input
              type="text"
              placeholder="Scan or enter Student ID"
              value={scannedId}
              onChange={(e) => setScannedId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <button onClick={handleScan} className="scan-btn">Scan</button>
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

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const [open, setOpen] = useState(false);

  const closeOnNavigate = () => setOpen(false);

  return (
    <>
      {/* Fixed sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="app-title">Library</span>
          <button className="close-btn" onClick={() => setOpen(false)} aria-label="Close sidebar">
            ✕
          </button>
        </div>
        <nav className="menu">
          <NavLink to="/" end className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeOnNavigate}>
            Dashboard
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeOnNavigate}>
            Attendance
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeOnNavigate}>
            Students
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeOnNavigate}>
            Reports
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Spacer to push main content to the right on desktop */}
      <div className="sidebar-spacer" />

      {/* Mobile hamburger */}
      <button className="hamburger" onClick={() => setOpen(true)} aria-label="Open sidebar">
        ☰
      </button>
    </>
  );
};

export default Sidebar;

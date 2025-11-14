import React from 'react';

const TeacherDashboard = ({ onLogout }) => {
  const user = localStorage.getItem('userEmail') || 'teacher';
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Teacher Dashboard</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: '#555' }}>{user}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <section style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h3>Today's Entries</h3>
          <p>List of students who scanned IN today (during your periods).</p>
          <div style={{ color: '#777', fontSize: 14 }}>Coming soon: filter by class/slot.</div>
        </section>
        <section style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h3>Violations</h3>
          <p>Students who entered the library without a scheduled library slot.</p>
          <div style={{ color: '#777', fontSize: 14 }}>Coming soon: approve/notify actions.</div>
        </section>
      </div>

      <section style={{ marginTop: 16, background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <h3>My Library Slots (Today)</h3>
        <p>Overview of your timetable slots mapped to library access windows.</p>
        <div style={{ color: '#777', fontSize: 14 }}>Coming soon: pull from timetable API.</div>
      </section>
    </div>
  );
};

export default TeacherDashboard;

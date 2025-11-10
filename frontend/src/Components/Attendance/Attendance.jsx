import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, API_BASE } from '../../api/client';

const Attendance = () => {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [division, setDivision] = useState('');
  const [subject, setSubject] = useState('');
  const [studentId, setStudentId] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [marking, setMarking] = useState(false);
  const [markStudentId, setMarkStudentId] = useState('');
  const [markAction, setMarkAction] = useState('in');

  const qs = new URLSearchParams({
    date: date || '',
    department: department || '',
    year: year || '',
    division: division || '',
    subject: subject || '',
    student_id: studentId || '',
    page: String(page),
    page_size: String(pageSize),
  }).toString();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet(`/attendance?${qs}`);
      setRows(data?.items || []);
      setTotal(data?.total || 0);
    } catch (e) {
      setRows([]);
      setTotal(0);
      setError(e?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, department, year, division, subject, studentId, page, pageSize]);

  async function onExport() {
    const url = `${API_BASE}/attendance/export?${qs}`;
    window.open(url, '_blank');
  }

  async function onMark(e) {
    e.preventDefault();
    if (!markStudentId) return;
    setMarking(true);
    setError('');
    try {
      await apiPost('/attendance/mark', {
        student_id: markStudentId,
        date,
        department: department || undefined,
        year: year || undefined,
        division: division || undefined,
        subject: subject || undefined,
        action: markAction,
      });
      setMarkStudentId('');
      await load();
    } catch (e) {
      setError(e?.message || 'Failed to mark');
    } finally {
      setMarking(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ padding: 24, display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Attendance</h2>

      {error ? (
        <div style={{ padding: 12, background: '#ffe5e5', color: '#b00020', border: '1px solid #ffb3b3' }}>{error}</div>
      ) : null}

      <section style={{ display: 'grid', gap: 12, background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(120px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12 }}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 12 }}>Department</label>
            <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="CSE" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 12 }}>Year</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="SE/TE/BE" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 12 }}>Division</label>
            <input value={division} onChange={(e) => setDivision(e.target.value)} placeholder="A/B" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 12 }}>Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 12 }}>Student ID</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="ID" style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => load()} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button onClick={onExport} disabled={loading || total === 0}>Export CSV</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 12 }}>Page size</label>
            <select value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 8 }}>
        <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#fafafa' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Student ID</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Subject</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>In Time</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Out Time</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Status</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 16, textAlign: 'center', color: '#666' }}>No data</td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.student_id || '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.name || '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.subject || '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.in_time ? new Date(r.in_time).toLocaleString() : '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.out_time ? new Date(r.out_time).toLocaleString() : '-'}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 12, background: r.status === 'Late' ? '#fff2cc' : '#e6ffed', border: '1px solid #eee' }}>{r.status || 'Present'}</span>
                    </td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{r.source || 'scan'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>Showing {rows.length} of {total} records</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 8, background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
        <h3 style={{ margin: 0 }}>Manual mark</h3>
        <form onSubmit={onMark} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={markStudentId} onChange={(e) => setMarkStudentId(e.target.value)} placeholder="Student ID" />
          <select value={markAction} onChange={(e) => setMarkAction(e.target.value)}>
            <option value="in">IN</option>
            <option value="out">OUT</option>
          </select>
          <button type="submit" disabled={marking}>{marking ? 'Saving...' : 'Mark'}</button>
        </form>
      </section>
    </div>
  );
};

export default Attendance;

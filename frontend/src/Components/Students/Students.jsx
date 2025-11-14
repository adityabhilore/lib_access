import React, { useMemo, useState } from 'react';

const DEPARTMENTS = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electrical'];
const YEARS = ['FY', 'SY', 'TY', 'Final'];
const STATUS = ['active', 'inactive'];

const makeMock = () => {
  const names = ['Aarav', 'Isha', 'Kunal', 'Mira', 'Neha', 'Rohan', 'Sara', 'Vikram'];
  const arr = [];
  for (let i = 1; i <= 24; i++) {
    const n = names[i % names.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const year = YEARS[i % YEARS.length];
    const status = i % 7 === 0 ? 'inactive' : 'active';
    arr.push({
      id: i,
      full_name: `${n} ${String.fromCharCode(64 + (i % 26 || 26))}`,
      roll_no: `LIB${String(i).padStart(4, '0')}`,
      department: dept,
      year,
      email: `${n.toLowerCase()}${i}@example.com`,
      phone: `98${String(100000000 + i).slice(1)}`,
      status,
      attendance: { today: i % 3 === 0 ? 0 : 1, week: (i * 3) % 6, month: (i * 7) % 22 },
    });
  }
  return arr;
};

const Students = () => {
  const [students, setStudents] = useState(makeMock());
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [stat, setStat] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add | edit | view
  const emptyForm = { id: null, full_name: '', roll_no: '', department: '', year: '', email: '', phone: '', status: 'active' };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => {
    let data = students;
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(s => s.full_name.toLowerCase().includes(q) || s.roll_no.toLowerCase().includes(q));
    }
    if (dept) data = data.filter(s => s.department === dept);
    if (year) data = data.filter(s => s.year === year);
    if (stat) data = data.filter(s => s.status === stat);
    return data;
  }, [students, query, dept, year, stat]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const resetPaging = () => setPage(1);

  const openAdd = () => { setModalMode('add'); setForm({ ...emptyForm }); setErrors({}); setModalOpen(true); };
  const openView = (row) => { setModalMode('view'); setForm({ ...row }); setErrors({}); setModalOpen(true); };
  const openEdit = (row) => { setModalMode('edit'); setForm({ ...row }); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Name is required';
    if (!form.roll_no.trim()) e.roll_no = 'Roll No is required';
    if (!form.department) e.department = 'Department is required';
    if (!form.year) e.year = 'Year is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^\d{10}$/.test(form.phone)) e.phone = '10-digit phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (modalMode === 'add') {
      const nextId = Math.max(0, ...students.map(s => s.id)) + 1;
      setStudents(prev => [{ id: nextId, attendance: { today: 0, week: 0, month: 0 }, ...form }, ...prev]);
    } else if (modalMode === 'edit') {
      setStudents(prev => prev.map(s => s.id === form.id ? { ...s, ...form } : s));
    }
    setModalOpen(false);
  };

  const remove = (row) => {
    if (!window.confirm(`Delete ${row.full_name}?`)) return;
    setStudents(prev => prev.filter(s => s.id !== row.id));
  };

  const exportCSV = () => {
    const headers = ['id','full_name','roll_no','department','year','email','phone','status'];
    const rows = students.map(s => headers.map(h => (s[h] ?? '')).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = () => {
    alert('Import CSV: coming soon. (We will parse and merge records)');
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Students</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={openAdd}>Add Student</button>
          <button onClick={importCSV}>Import CSV</button>
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); resetPaging(); }}
          placeholder="Search name or roll no"
          style={{ padding: '8px 10px', minWidth: 220 }}
        />
        <select value={dept} onChange={(e) => { setDept(e.target.value); resetPaging(); }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={year} onChange={(e) => { setYear(e.target.value); resetPaging(); }}>
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={stat} onChange={(e) => { setStat(e.target.value); resetPaging(); }}>
          <option value="">All Status</option>
          {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Rows:</span>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); resetPaging(); }}>
            {[5,8,10,15].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['ID','Name','Roll No','Department','Year','Status','Today','Week','Month','Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={10} style={{ padding: 18, textAlign: 'center', color: '#666' }}>No students found</td>
              </tr>
            )}
            {pageRows.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 10 }}>{row.id}</td>
                <td style={{ padding: 10 }}>{row.full_name}</td>
                <td style={{ padding: 10 }}>{row.roll_no}</td>
                <td style={{ padding: 10 }}>{row.department}</td>
                <td style={{ padding: 10 }}>{row.year}</td>
                <td style={{ padding: 10 }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 999, fontSize: 12,
                    background: row.status === 'active' ? '#e8faf0' : '#fde8e8',
                    color: row.status === 'active' ? '#137c39' : '#b91c1c',
                    border: `1px solid ${row.status === 'active' ? '#abdfbe' : '#f6b3b3'}`,
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: 10 }}>{row.attendance.today}</td>
                <td style={{ padding: 10 }}>{row.attendance.week}</td>
                <td style={{ padding: 10 }}>{row.attendance.month}</td>
                <td style={{ padding: 10 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openView(row)}>View</button>
                    <button onClick={() => openEdit(row)}>Edit</button>
                    <button onClick={() => remove(row)} style={{ color: '#b91c1c' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ color: '#555' }}>Showing {start + 1}-{Math.min(start + pageSize, total)} of {total}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
          <span style={{ alignSelf: 'center' }}>Page {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', width: 520, maxWidth: '92%', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <strong>{modalMode === 'add' ? 'Add Student' : modalMode === 'edit' ? 'Edit Student' : 'Student Details'}</strong>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={save} style={{ padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Name</label>
                  <input value={form.full_name} disabled={modalMode==='view'} onChange={e=>setForm(f=>({...f, full_name:e.target.value}))} />
                  {errors.full_name && <div style={{ color:'#b91c1c', fontSize:12 }}>{errors.full_name}</div>}
                </div>
                <div>
                  <label>Roll No</label>
                  <input value={form.roll_no} disabled={modalMode==='view'} onChange={e=>setForm(f=>({...f, roll_no:e.target.value}))} />
                  {errors.roll_no && <div style={{ color:'#b91c1c', fontSize:12 }}>{errors.roll_no}</div>}
                </div>
                <div>
                  <label>Department</label>
                  <select value={form.department} disabled={modalMode==='view'} onChange={e=>setForm(f=>({...f, department:e.target.value}))}>
                    <option value="">Select</option>
                    {DEPARTMENTS.map(d=> <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <div style={{ color:'#b91c1c', fontSize:12 }}>{errors.department}</div>}
                </div>
                <div>
                  <label>Year</label>
                  <select value={form.year} disabled={modalMode==='view'} onChange={e=>setForm(f=>({...f, year:e.target.value}))}>
                    <option value="">Select</option>
                    {YEARS.map(y=> <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <div style={{ color:'#b91c1c', fontSize:12 }}>{errors.year}</div>}
                </div>
                <div>
                  <label>Email</label>
                  <input value={form.email} disabled={modalMode==='view'} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
                  {errors.email && <div style={{ color:'#b91c1c', fontSize:12 }}>{errors.email}</div>}
                </div>
                <div>
                  <label>Phone</label>
                  <input value={form.phone} disabled={modalMode==='view'} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} />
                  {errors.phone && <div style={{ color:'#b91c1c', fontSize:12 }}>{errors.phone}</div>}
                </div>
                <div>
                  <label>Status</label>
                  <select value={form.status} disabled={modalMode==='view'} onChange={e=>setForm(f=>({...f, status:e.target.value}))}>
                    {STATUS.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {modalMode !== 'view' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                  <button type="button" onClick={()=>setModalOpen(false)}>Cancel</button>
                  <button type="submit">Save</button>
                </div>
              )}
              {modalMode === 'view' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                  <button type="button" onClick={()=>setModalOpen(false)}>Close</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;

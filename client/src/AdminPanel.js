import React, { useEffect, useState } from 'react';
import './AdminPanel.css';

function AdminPanel({ user, token, showToast }) {
  const [users, setUsers] = useState([]);
  const [ous, setOus] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [editState, setEditState] = useState({}); // { userId: { divisions: [], ous: [], role: '' } }

  useEffect(() => {
    if (user.role === 'admin') {
      fetch('/api/admin/all', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          setUsers(data.users);
          setOus(data.ous);
          setDivisions(data.divisions);
        });
    }
  }, [user, token, message]);

  const handleEditChange = (userId, field, value) => {
    setEditState(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (u) => {
    setMessage('');
    const state = editState[u._id] || {};
    const divisionIds = state.divisions || u.divisions.map(d => d._id);
    const ouIds = state.ous || u.ous.map(o => o._id);
    const role = state.role || u.role;
    let ok = true;
    const res1 = await fetch('/api/admin/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId: u._id, divisionIds, ouIds }),
    });
    if (!res1.ok) ok = false;
    const res2 = await fetch('/api/admin/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId: u._id, role }),
    });
    if (!res2.ok) ok = false;
    setMessage(ok ? 'Changes saved!' : 'Error saving changes');
    if (showToast) showToast(ok ? 'Changes saved!' : 'Error saving changes', ok ? 'success' : 'error');
    setEditState(prev => ({ ...prev, [u._id]: {} }));
  };

  if (user.role !== 'admin') return null;

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <h3>Admin Panel</h3>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>OUs</th>
            <th>Divisions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>
                <select
                  value={editState[u._id]?.role || u.role}
                  onChange={e => handleEditChange(u._id, 'role', e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <select
                  multiple
                  value={editState[u._id]?.ous || u.ous.map(o => o._id)}
                  onChange={e => handleEditChange(u._id, 'ous', Array.from(e.target.selectedOptions, o => o.value))}
                >
                  {ous.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
              </td>
              <td>
                <select
                  multiple
                  value={editState[u._id]?.divisions || u.divisions.map(d => d._id)}
                  onChange={e => handleEditChange(u._id, 'divisions', Array.from(e.target.selectedOptions, o => o.value))}
                >
                  {divisions.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </td>
              <td>
                <button onClick={() => handleSave(u)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <div className="success">{message}</div>}
    </div>
  );
}

export default AdminPanel;

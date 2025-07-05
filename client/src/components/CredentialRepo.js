// CredentialRepo.js - Handles viewing, adding, editing, and deleting credentials for a user's divisions
import React, { useState, useEffect } from 'react';
import '../styles/CredentialRepo.css';
import CredentialRow from './CredentialRow';

function CredentialRepo({ user, token, showToast }) {
  // State for user's divisions, selected division, and credentials
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [credentials, setCredentials] = useState([]);
  const [newCred, setNewCred] = useState({ name: '', value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch division info for the user (admin gets all, others get only their divisions)
  useEffect(() => {
    if (user && user.divisions && user.divisions.length > 0) {
      if (user.role === 'admin') {
        fetch('/api/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => {
            if (data.divisions) {
              const userDivs = data.divisions.filter(d => user.divisions.includes(d._id));
              setDivisions(userDivs);
              if (userDivs.length > 0) setSelectedDivision(userDivs[0]._id);
            } else {
              setDivisions([]);
            }
          })
          .catch(() => setDivisions([]));
      } else {
        // For non-admins, fetch division info by IDs
        Promise.all(
          user.divisions.map(id =>
            fetch(`/api/division/${id}`, { headers: { Authorization: `Bearer ${token}` } })
              .then(res => res.ok ? res.json() : null)
          )
        ).then(divs => {
          const filtered = divs.filter(Boolean);
          setDivisions(filtered);
          if (filtered.length > 0) setSelectedDivision(filtered[0]._id);
        });
      }
    }
  }, [user, token]);

  // Fetch credentials for the selected division
  useEffect(() => {
    if (selectedDivision) {
      setLoading(true);
      fetch(`/api/credentials/${selectedDivision}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setCredentials(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedDivision, token, success]);

  // Add a new credential
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/credentials/${selectedDivision}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCred),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setCredentials(data);
      setNewCred({ name: '', value: '' });
      setSuccess('Credential added!');
      if (showToast) showToast('Credential added!', 'success');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Update a credential (manager/admin only)
  const handleUpdate = async (credId, updated) => {
    setError('');
    setSuccess('');
    const res = await fetch(`/api/credentials/${selectedDivision}/${credId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    if (!res.ok) {
      if (showToast) showToast(data.message || 'Error', 'error');
      throw new Error(data.message || 'Error');
    }
    setSuccess('Credential updated!');
    if (showToast) showToast('Credential updated!', 'success');
    setCredentials(creds => creds.map(c => c._id === credId ? { ...c, ...updated } : c));
    setTimeout(() => setSuccess(''), 2000);
  };

  // Delete a credential (manager/admin only)
  const handleDelete = async (credId) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/credentials/${selectedDivision}/${credId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setCredentials(creds => creds.filter(c => c._id !== credId));
      if (showToast) showToast('Credential deleted!', 'success');
    } catch (err) {
      setError(err.message);
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Only managers/admins can edit/delete
  const canEdit = user.role === 'manager' || user.role === 'admin';

  // Render credential repository UI
  return (
    <div className="cred-repo">
      <h3>Your Division Credential Repositories</h3>
      {/* Division selector */}
      <select value={selectedDivision} onChange={e => setSelectedDivision(e.target.value)}>
        {divisions.map(div => (
          <option key={div._id} value={div._id}>{div.name}</option>
        ))}
      </select>
      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr><th>Name</th><th>Value</th>{canEdit && <th>Actions</th>}</tr>
          </thead>
          <tbody>
            {credentials.map(cred => (
              <CredentialRow
                key={cred._id}
                cred={cred}
                canEdit={canEdit}
                onUpdate={updated => handleUpdate(cred._id, updated)}
                onDelete={() => handleDelete(cred._id)}
              />
            ))}
          </tbody>
        </table>
      )}
      {/* Add credential form */}
      <form className="add-cred-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Credential Name"
          value={newCred.name}
          onChange={e => setNewCred({ ...newCred, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Credential Value"
          value={newCred.value}
          onChange={e => setNewCred({ ...newCred, value: e.target.value })}
          required
        />
        <button type="submit">Add Credential</button>
      </form>
      {/* Inline error/success messages (toasts are also used) */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
}

export default CredentialRepo;

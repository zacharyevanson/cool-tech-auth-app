// CredentialRow.js - Table row for a single credential, with edit/delete for managers/admins
import React, { useState } from 'react';
import '../styles/CredentialRepo.css';

function CredentialRow({ cred, canEdit, onUpdate, onDelete }) {
  // State for editing mode and form values
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState({ name: cred.name, value: cred.value });
  const [error, setError] = useState('');

  // Save changes to credential
  const handleSave = async () => {
    setError('');
    try {
      await onUpdate(editVal);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // render row in view or edit mode
  if (!editing) {
    return (
      <tr>
        <td>{cred.name}</td>
        <td>{cred.value}</td>
        {canEdit && (
          <td style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Edit and Delete buttons for managers/admins */}
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </td>
        )}
      </tr>
    );
  }
  return (
    <tr>
      <td><input value={editVal.name} onChange={e => setEditVal({ ...editVal, name: e.target.value })} /></td>
      <td><input value={editVal.value} onChange={e => setEditVal({ ...editVal, value: e.target.value })} /></td>
      <td>
        {/* Save and Cancel buttons in edit mode */}
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setEditing(false)}>Cancel</button>
        {error && <div className="error">{error}</div>}
      </td>
    </tr>
  );
}

export default CredentialRow;

import React from 'react';
import './Toast.css';

function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`} onClick={onClose}>
      {message}
    </div>
  );
}

export default Toast;

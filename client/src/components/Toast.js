// Toast.js - Simple toast notification component for feedback
import React from 'react';
import '../styles/Toast.css';

function Toast({ message, type = 'success', onClose }) {
  // If no message, don't render anything
  if (!message) return null;
  // Render toast with message
  return (
    <div className={`toast ${type}`} onClick={onClose}>
      {message}
    </div>
  );
}

export default Toast;

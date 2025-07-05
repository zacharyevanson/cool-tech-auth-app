// App.js - Main entry point for the React app
import React, { useState } from 'react';
import AuthForm from './components/AuthForm'; // Login/Register form
import CredentialRepo from './components/CredentialRepo'; // Credential management UI
import AdminPanel from './components/AdminPanel'; // Admin management UI
import Toast from './components/Toast'; // Toast notification component
import './App.css';

function App() {
  // State for the logged-in user
  const [user, setUser] = useState(null);
  // State for toggling between login and register
  const [showRegister, setShowRegister] = useState(false);
  // State for toast notifications
  const [toast, setToast] = useState({ message: '', type: 'success' });
  // State for JWT token
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Helper to show toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type }), 2500);
  };

  // Handle successful login/register
  const handleAuth = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    showToast('Success!');
  };

  // If not logged in, show login/register UI
  if (!user) {
    return (
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          {/* Toggle between Login and Register */}
          <button onClick={() => setShowRegister(false)} style={{ fontWeight: !showRegister ? 'bold' : 'normal' }}>Login</button>
          <button onClick={() => setShowRegister(true)} style={{ fontWeight: showRegister ? 'bold' : 'normal' }}>Register</button>
        </div>
        {/* AuthForm handles login/register */}
        <AuthForm onAuth={handleAuth} type={showRegister ? 'register' : 'login'} />
        {/* Toast notification for feedback */}
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    );
  }

  // If logged in, show dashboard with logout, credential repo, and admin panel if admin
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Welcome, {user.username}!</h2>
          <p>Role: {user.role}</p>
        </div>
        {/* Logout button clears user/token and shows toast */}
        <button
          style={{ padding: "0.5rem", background: 'red', color: 'white', fontSize: '1rem', cursor: 'pointer', marginRight: '2rem' }}
          onClick={() => {
            setUser(null);
            setToken('');
            localStorage.removeItem('token');
            showToast('Logged out!', 'success');
          }}
        >
          Logout
        </button>
      </div>
      {/* Toast notification for feedback */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {/* CredentialRepo: credential management for user's divisions */}
      <CredentialRepo user={user} token={token} showToast={showToast} />
      {/* AdminPanel: only visible to admin users */}
      {user.role === 'admin' && <AdminPanel user={user} token={token} showToast={showToast} />}
    </div>
  );
}

export default App;

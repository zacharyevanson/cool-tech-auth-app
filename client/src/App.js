import React, { useState } from 'react';
import AuthForm from './AuthForm';
import CredentialRepo from './CredentialRepo';
import AdminPanel from './AdminPanel';
import Toast from './Toast';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type }), 2500);
  };

  const handleAuth = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    showToast('Success!');
  };

  if (!user) {
    return (
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={() => setShowRegister(false)} style={{ fontWeight: !showRegister ? 'bold' : 'normal' }}>Login</button>
          <button onClick={() => setShowRegister(true)} style={{ fontWeight: showRegister ? 'bold' : 'normal' }}>Register</button>
        </div>
        <AuthForm onAuth={handleAuth} type={showRegister ? 'register' : 'login'} />
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    );
  }

  return (
    <div className="App">
      <h2>Welcome, {user.username}!</h2>
      <p>Role: {user.role}</p>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <CredentialRepo user={user} token={token} showToast={showToast} />
      {user.role === 'admin' && <AdminPanel user={user} token={token} showToast={showToast} />}
    </div>
  );
}

export default App;

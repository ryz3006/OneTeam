import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Firebase Auth requires an email format. We'll construct one from the username.
    // This allows the user to just type "admin".
    // IMPORTANT: Make sure the user in Firebase Auth is set to "admin@oneteam.local".
    const authEmail = username.includes('@') ? username : `${username}@oneteam.local`;

    try {
      await signInWithEmailAndPassword(auth, authEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error("Admin login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#343a40' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1c1e21', margin: '0 0 10px 0' }}>OneTeam Admin</h1>
        <p style={{ fontSize: '1.2rem', color: '#606770', marginBottom: '30px' }}>Administrator Control Panel</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" // Changed from "email" to "text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ padding: '12px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
          />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ padding: '12px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
          />
          {error && <p style={{ color: 'red', margin: '0' }}>{error}</p>}
          <button 
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', padding: '12px 24px', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.3s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

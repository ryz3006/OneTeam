import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin'); // Default for convenience
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Note: In a real app, you would also check if the logged-in user has an 'isAdmin' flag in Firestore.
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to log in. Check credentials.');
      console.error("Admin login error:", err);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default AdminLoginPage;

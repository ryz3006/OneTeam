import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#343a40', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Admin Panel</h1>
        <div>
          <span style={{ marginRight: '20px' }}>{user ? user.email : 'Admin'}</span>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>
      <main style={{ padding: '30px' }}><h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Management Dashboard</h2></main>
    </div>
  );
};

export default AdminDashboardPage;

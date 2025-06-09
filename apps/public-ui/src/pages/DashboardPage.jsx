import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Navigate back to login page on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', paddingTop: '50px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px 40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1c1e21', margin: '0' }}>
            Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
          >
            Logout
          </button>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#606770', marginBottom: '30px' }}>
          Welcome, {user ? user.displayName : 'User'}!
        </p>

        <div style={{ border: '1px dashed #ccc', padding: '40px', borderRadius: '6px', color: '#888', textAlign: 'center' }}>
          <p>Your project and task data will appear here.</p>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;

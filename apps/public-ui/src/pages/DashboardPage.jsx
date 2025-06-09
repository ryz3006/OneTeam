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
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user ? user.displayName : 'Guest'}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;

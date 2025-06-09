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
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user ? user.email : 'Admin'}!</p>
      <p>This is where you will manage projects, users, and roles.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboardPage;

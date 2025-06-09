import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import UserManagementPage from './pages/UserManagementPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/dashboard" element={<AdminDashboardPage />} />
      <Route path="/projects" element={<ProjectManagementPage />} />
      <Route path="/users" element={<UserManagementPage />} />
    </Routes>
  );
}

export default App;

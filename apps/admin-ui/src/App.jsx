import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ProjectManagementPage from './pages/ProjectManagementPage.jsx'; // .jsx added
import UserManagementPage from './pages/UserManagementPage.jsx';   // .jsx added

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

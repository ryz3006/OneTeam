import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ProjectManagementPage from './pages/ProjectManagementPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/dashboard" element={<Layout><AdminDashboardPage /></Layout>} />
      <Route path="/projects" element={<Layout><ProjectManagementPage /></Layout>} />
      <Route path="/users" element={<Layout><UserManagementPage /></Layout>} />
      <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
    </Routes>
  );
}

export default App;

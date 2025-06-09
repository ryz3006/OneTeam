import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // You will create this

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      {/* Add other admin routes here */}
    </Routes>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage';
import ProjectSelectionPage from './pages/ProjectSelectionPage';
import NoProjectsPage from './pages/NoProjectsPage';
import DashboardPage from './pages/DashboardPage';

// Placeholder pages
const TasksPage = () => <div className="dark:text-white">Tasks Page Content</div>;
const WorkReportPage = () => <div className="dark:text-white">Work Report Page Content</div>;
const ShiftSchedulePage = () => <div className="dark:text-white">Shift Schedule Page Content</div>;
const DocumentsPage = () => <div className="dark:text-white">Documents Page Content</div>;
const ProfilePage = () => <div className="dark:text-white">Profile Page Content</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/project-selection" element={<ProjectSelectionPage />} />
      <Route path="/no-projects" element={<NoProjectsPage />} />
      <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/tasks" element={<Layout><TasksPage /></Layout>} />
      <Route path="/reports" element={<Layout><WorkReportPage /></Layout>} />
      <Route path="/schedule" element={<Layout><ShiftSchedulePage /></Layout>} />
      <Route path="/documents" element={<Layout><DocumentsPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
    </Routes>
  );
}

export default App;

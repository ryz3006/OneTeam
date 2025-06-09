import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, description, link, linkText, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4 mb-4">
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    <Link to={link} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
      {linkText} &rarr;
    </Link>
  </div>
);

const AdminDashboardPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Projects"
        description="Create, edit, and assign users to projects."
        link="/projects"
        linkText="Manage Projects"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
      />
      <DashboardCard
        title="Users"
        description="Invite new users and manage roles and designations."
        link="/users"
        linkText="Manage Users"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" /></svg>}
      />
      <DashboardCard
        title="Work Reports"
        description="View and analyze work reports from all users."
        link="#"
        linkText="View Reports"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m11 0v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m11 0a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>}
      />
    </div>
  );
};

export default AdminDashboardPage;

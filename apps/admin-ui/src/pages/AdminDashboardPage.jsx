import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// --- Reusable Components ---
const DashboardCard = ({ title, description, link, linkText, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4 mb-4">
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    <Link to={link} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">{linkText} &rarr;</Link>
  </div>
);

const UserNode = ({ user, allUsers, level }) => {
    const subordinates = allUsers.filter(u => u.reportingTo === user.id);
    return (
        <div style={{ marginLeft: `${level * 20}px` }} className="my-2">
            <div className="flex items-center bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
                <div className="font-semibold text-gray-800 dark:text-white">{user.displayName || user.email}</div>
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">({user.designation || 'N/A'})</div>
            </div>
            {subordinates.length > 0 && (
                <div className="border-l-2 border-blue-500 pl-4">
                    {subordinates.map(sub => <UserNode key={sub.id} user={sub} allUsers={allUsers} level={level + 1} />)}
                </div>
            )}
        </div>
    );
};

// --- Main Dashboard Page Component ---
const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, "users"), snap => setUsers(snap.docs.map(d => ({id: d.id, ...d.data()}))));
        const unsubProjects = onSnapshot(collection(db, "projects"), snap => setProjects(snap.docs.map(d => ({id: d.id, ...d.data()}))));
        return () => { unsubUsers(); unsubProjects(); };
    }, []);

    const userHierarchy = useMemo(() => {
        const topLevelUsers = users.filter(u => !u.reportingTo);
        return topLevelUsers;
    }, [users]);
    
    const escalationMatrix = useMemo(() => {
        if (!selectedProject) return [];
        const projectUsers = users.filter(u => (u.mappedProjects || []).includes(selectedProject));
        // Simple sort by designation - a more complex sort would use a predefined order
        return projectUsers.sort((a,b) => (a.designation || "").localeCompare(b.designation || ""));
    }, [selectedProject, users]);

    const renderContent = () => {
        switch (activeTab) {
            case 'hierarchy':
                return (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        {userHierarchy.map(user => <UserNode key={user.id} user={user} allUsers={users} level={0} />)}
                    </div>
                );
            case 'escalation':
                return (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <label htmlFor="project-select" className="mr-4 font-semibold dark:text-white">Select a Project:</label>
                            <select id="project-select" value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="p-2 rounded-md dark:bg-gray-700 dark:text-white">
                                <option value="">-- Select --</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        {selectedProject && (
                            <table className="min-w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Designation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {escalationMatrix.map((user, index) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">L{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{user.displayName || user.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{user.designation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DashboardCard title="Projects" description="Create, edit, and assign users to projects." link="/projects" linkText="Manage Projects" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                      <DashboardCard title="Users" description="Invite new users and manage roles and designations." link="/users" linkText="Manage Users" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" /></svg>} />
                      <DashboardCard title="Work Reports" description="View and analyze work reports from all users." link="#" linkText="View Reports" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m11 0v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m11 0a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>} />
                    </div>
                );
        }
    };
    
    const TabButton = ({ name, label }) => (
        <button onClick={() => setActiveTab(name)} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === name ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
            {label}
        </button>
    );

  return (
    <div className="flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-2">
                <TabButton name="overview" label="Overview" />
                <TabButton name="hierarchy" label="User Hierarchy" />
                <TabButton name="escalation" label="Project Escalation Matrix" />
            </nav>
        </div>
        <div className="mt-6">
            {renderContent()}
        </div>
    </div>
  );
};

export default AdminDashboardPage;

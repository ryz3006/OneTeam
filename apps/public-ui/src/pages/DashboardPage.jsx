import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/50`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    // Mock data - replace with Firebase data fetching
    const summaryData = {
        openTasks: 5,
        hoursLogged: '32h 15m',
        projectTickets: '12 / 5 / 3 / 2 / 48'
    };
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="My Open Tasks" value={summaryData.openTasks} color="blue" icon={<TasksIcon />} />
            <DashboardCard title="Hours Logged (Week)" value={summaryData.hoursLogged} color="green" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <DashboardCard title="Project Tickets" value={summaryData.projectTickets} color="yellow" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" /></svg>} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Project Workload</h3>
            {/* Placeholder for a chart component */}
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Chart will be displayed here</p>
            </div>
        </div>
    </div>
  );
};

export default DashboardPage;

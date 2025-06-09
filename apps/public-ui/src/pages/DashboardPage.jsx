import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Mock data for the dashboard components
const mockData = {
  ticketSummary: [
    { title: 'Open', value: 12, color: '#3b82f6' },
    { title: 'In-Progress', value: 5, color: '#f59e0b' },
    { title: 'On Hold', value: 3, color: '#6b7280' },
    { title: 'Blocker', value: 2, color: '#ef4444' },
    { title: 'Closed', value: 48, color: '#22c55e' },
  ],
  workHours: [
    { day: 'Mon', hours: 7.5 },
    { day: 'Tue', hours: 8.0 },
    { day: 'Wed', hours: 6.0 },
    { day: 'Thu', hours: 8.5 },
    { day: 'Fri', hours: 7.0 },
  ],
  projectWorkload: [
    { name: 'Project Alpha', value: 40, color: '#3b82f6' },
    { name: 'Project Bravo', value: 25, color: '#10b981' },
    { name: 'Project Charlie', value: 20, color: '#f59e0b' },
    { name: 'Support Tickets', value: 15, color: '#ef4444' },
  ],
  openTasks: [
    { id: 'JIRA-123', summary: 'Fix login button alignment on Safari', status: 'In-Progress' },
    { id: 'JIRA-125', summary: 'Update documentation for API v2', status: 'Open' },
    { id: 'JIRA-110', summary: 'Third-party dependency upgrade required', status: 'Blocker' },
  ]
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Set user on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/'); // If no user, redirect to login
      }
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (!user) {
    return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '50px' }}>Loading...</div>; // Loading state
  }

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1c1e21', margin: '0 0 5px 0' }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#606770', margin: '0' }}>
              Welcome back, {user.displayName}!
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ backgroundColor: '#6c757d', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer', transition: 'background-color 0.3s' }}
          >
            Logout
          </button>
        </div>

        {/* Date Filters */}
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label htmlFor="start-date" style={{ fontWeight: '500' }}>Date Range:</label>
          <input type="date" id="start-date" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <span>-</span>
          <input type="date" id="end-date" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Apply</button>
        </div>

        {/* Ticket Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {mockData.ticketSummary.map(item => (
            <div key={item.title} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#606770' }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Work Hours Logged */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Daily Work Hours</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px', marginTop: '20px' }}>
              {mockData.workHours.map(d => (
                <div key={d.day} style={{ textAlign: 'center', width: '15%' }}>
                  <div style={{ backgroundColor: '#3b82f6', height: `${d.hours * 15}px`, borderRadius: '4px 4px 0 0' }}></div>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#606770' }}>{d.day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project Workload */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Project Workload</h2>
            <div style={{ marginTop: '20px' }}>
              {mockData.projectWorkload.map(p => (
                <div key={p.name} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.9rem' }}>{p.name}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{p.value}%</span>
                  </div>
                  <div style={{ backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
                    <div style={{ backgroundColor: p.color, width: `${p.value}%`, height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Open Tasks */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gridColumn: '1 / -1' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>My Open Tasks</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {mockData.openTasks.map(task => (
                <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>{task.summary}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#606770' }}>{task.id}</p>
                  </div>
                  <span style={{ backgroundColor: mockData.ticketSummary.find(s => s.title === task.status)?.color || '#ccc', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>{task.status}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

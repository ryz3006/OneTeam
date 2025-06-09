import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project Alpha', crmId: 'CRM001', owners: 'Riyas, Jane Doe', status: 'Active' },
    { id: 2, name: 'Project Bravo', crmId: 'CRM002', owners: 'John Smith', status: 'Active' },
    { id: 3, name: 'Support & Operations', crmId: '', owners: 'Admin', status: 'Ongoing' },
  ]);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <header style={{ backgroundColor: '#343a40', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Admin Panel</Link></h1>
            <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>+ Create Project</button>
        </header>
        <main style={{ padding: '30px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Project Management</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px' }}>Project Name</th>
                            <th style={{ padding: '12px' }}>CRMID</th>
                            <th style={{ padding: '12px' }}>Owners</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={project.id} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{project.name}</td>
                                <td style={{ padding: '12px' }}>{project.crmId || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>{project.owners}</td>
                                <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{project.status}</span></td>
                                <td style={{ padding: '12px' }}>
                                    <button style={{ marginRight: '10px', border: 'none', background: 'none', cursor: 'pointer', color: '#007bff' }}>Edit</button>
                                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc3545' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    </div>
  );
};

export default ProjectManagementPage;

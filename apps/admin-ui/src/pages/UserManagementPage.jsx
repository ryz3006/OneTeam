import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DESIGNATIONS = [
  'Head - Delivery & Support', 'AVP - Support & Operations', 'Senior Manager - Operations',
  'Manager - Operations', 'Associate Manager - Operations', 'Lead Engineer - Operations',
  'Senior Operations Engineer', 'Operations Engineer', 'Lead - L1 Operations',
  'Senior Engineer - L1 Operations', 'L1 Operations Engineer'
];

const UserManagementPage = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Riyas Siddikk', email: 'riyas@example.com', designation: 'Head - Delivery & Support', reportingTo: 'N/A' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', designation: 'Senior Manager - Operations', reportingTo: 'Riyas Siddikk' },
        { id: 3, name: 'John Smith', email: 'john@example.com', designation: 'Operations Engineer', reportingTo: 'Jane Doe' },
    ]);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <header style={{ backgroundColor: '#343a40', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Admin Panel</Link></h1>
            <button style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>+ Invite User</button>
        </header>
        <main style={{ padding: '30px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>User Management</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Designation</th>
                            <th style={{ padding: '12px' }}>Reporting To</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{user.name}</td>
                                <td style={{ padding: '12px' }}>{user.email}</td>
                                <td style={{ padding: '12px' }}>{user.designation}</td>
                                <td style={{ padding: '12px' }}>{user.reportingTo}</td>
                                <td style={{ padding: '12px' }}>
                                    <button style={{ marginRight: '10px', border: 'none', background: 'none', cursor: 'pointer', color: '#007bff' }}>Edit</button>
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

export default UserManagementPage;

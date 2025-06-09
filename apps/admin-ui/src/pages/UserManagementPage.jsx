import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

const MultiSelectDropdown = ({ options, selected, onSelectionChange, placeholder }) => {
    // ... component code remains the same
};


const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const projectOptions = useMemo(() => projects.map(p => ({ label: p.name, value: p.id })), [projects]);
  const projectMap = useMemo(() => projects.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {}), [projects]);
  
  const defaultNewUser = { email: '', contactNumber: '', designation: designations.length > 0 ? designations[0] : '', reportingTo: '', mappedProjects: [] };

  useEffect(() => {
    // ... useEffect remains the same
  }, []);
  
  // ... all other handler functions remain the same
  
  const filteredUsers = users.filter(u => (u.displayName || u.email).toLowerCase().includes(searchTerm.toLowerCase()));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
           <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button onClick={openAddUserModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">+ Add User</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
             <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mapped Projects</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading && <tr><td colSpan="4" className="text-center py-4 dark:text-gray-300">Loading users...</td></tr>}
              {!loading && paginatedUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.displayName || user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.designation || 'Not Set'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {(user.mappedProjects || []).map(pId => projectMap[pId]).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                    <button onClick={() => handleDeleteUser(user.id, user.displayName || user.email)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Previous</button>
            <span>Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredUsers.length / itemsPerPage)))} disabled={currentPage * itemsPerPage >= filteredUsers.length} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Next</button>
        </div>
      </div>
      
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            {/* ... modal code remains the same ... */}
        </div>
      )}
    </>
  );
};

export default UserManagementPage;

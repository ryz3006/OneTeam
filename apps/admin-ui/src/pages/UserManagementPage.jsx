import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, where, getDocs, writeBatch } from 'firebase/firestore';

const MultiSelectDropdown = ({ options, selected, onSelectionChange, placeholder }) => {
    // ... (component code remains the same)
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const projectOptions = useMemo(() => projects.map(p => ({ label: p.name, value: p.id })), [projects]);
  const projectMap = useMemo(() => projects.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {}), [projects]);
  
  const defaultNewUser = { email: '', designation: designations.length > 0 ? designations[0] : '', reportingTo: '', mappedProjects: [] };

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), snap => setUsers(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubProjects = onSnapshot(collection(db, "projects"), snap => setProjects(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubDesignations = onSnapshot(doc(db, 'settings', 'designations'), d => setDesignations(d.exists() ? d.data().list : []));
    setLoading(false);
    return () => { unsubUsers(); unsubProjects(); unsubDesignations(); };
  }, []);

  const openAddUserModal = () => { setIsEditing(false); setCurrentUser(defaultNewUser); setIsModalOpen(true); };
  const openEditModal = (user) => { setIsEditing(true); setCurrentUser({ ...user, mappedProjects: user.mappedProjects || [] }); setIsModalOpen(true); };
  
  const handleFormSubmit = async (e) => { e.preventDefault(); isEditing ? await handleEditUser() : await handleAddUser(); };

  const handleAddUser = async () => {
      if (!currentUser.email) return alert("Email is required.");
      try {
        await addDoc(collection(db, "users"), {
            email: currentUser.email,
            displayName: currentUser.email.split('@')[0],
            designation: currentUser.designation,
            reportingTo: currentUser.reportingTo,
            mappedProjects: currentUser.mappedProjects,
            isAdmin: false,
            createdAt: serverTimestamp()
        });
        alert(`User record for ${currentUser.email} created.`);
        setIsModalOpen(false);
      } catch (error) { console.error(error); alert("Failed to add user."); }
  };

  const handleEditUser = async () => {
    if (!currentUser) return;
    try {
        const userRef = doc(db, "users", currentUser.id);
        const oldUserData = users.find(u => u.id === currentUser.id);

        await updateDoc(userRef, {
            designation: currentUser.designation,
            reportingTo: currentUser.reportingTo,
            mappedProjects: currentUser.mappedProjects,
        });

        // Auto-assign projects to manager
        const managerId = currentUser.reportingTo;
        if (managerId) {
            const manager = users.find(u => u.id === managerId);
            if(manager) {
                const newProjectsForManager = new Set([...(manager.mappedProjects || []), ...currentUser.mappedProjects]);
                await updateDoc(doc(db, 'users', managerId), { mappedProjects: Array.from(newProjectsForManager) });
            }
        }

        setIsModalOpen(false);
    } catch(error) { console.error(error); alert("Failed to update user."); }
  };

  const handleDeleteUser = async (userId, userDisplayName) => {
    // 1. Check if user is an owner of any project
    const projectsOwnedQuery = query(collection(db, "projects"), where("ownerId", "==", userId));
    const ownedProjectsSnap = await getDocs(projectsOwnedQuery);
    if (!ownedProjectsSnap.empty) {
        alert(`Cannot delete user. They are the owner of project(s): ${ownedProjectsSnap.docs.map(d => d.data().name).join(', ')}. Please change the owner first.`);
        return;
    }

    // 2. Check if any other user reports to this user
    const subordinatesQuery = query(collection(db, "users"), where("reportingTo", "==", userId));
    const subordinatesSnap = await getDocs(subordinatesQuery);
    if(!subordinatesSnap.empty) {
        alert(`Cannot delete user. Other users report to them. Please reassign their manager first.`);
        return;
    }

    if(window.confirm(`Are you sure you want to delete ${userDisplayName}?`)) {
        try {
            await deleteDoc(doc(db, "users", userId));
            alert("User record deleted.");
        } catch(error) { console.error(error); alert("Failed to delete user."); }
    }
  }
  
  const handleUserInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentUser(prev => ({ ...prev, [name]: value }));
  }
  
  const handleProjectSelectionChange = (selection) => {
    setCurrentUser(prev => ({ ...prev, mappedProjects: selection }));
  }

  const renderModal = () => {
    // ... (modal rendering logic remains the same, but without the password field)
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Users</h2>
          <button onClick={openAddUserModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">+ Add User</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            {/* ... table headers ... */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading && <tr><td colSpan="4" className="text-center py-4 dark:text-gray-300">Loading users...</td></tr>}
              {!loading && users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.displayName || user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.designation || 'Not Set'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {(user.mappedProjects || []).map(pId => projectMap[pId]).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDeleteUser(user.id, user.displayName || user.email)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ... renderModal() call ... */}
    </>
  );
};

export default UserManagementPage;

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const DESIGNATIONS = [
  'Head - Delivery & Support', 'AVP - Support & Operations', 'Senior Manager - Operations',
  'Manager - Operations', 'Associate Manager - Operations', 'Lead Engineer - Operations',
  'Senior Operations Engineer', 'Operations Engineer', 'Lead - L1 Operations',
  'Senior Engineer - L1 Operations', 'L1 Operations Engineer'
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const openInviteModal = () => {
      setIsEditing(false);
      setIsModalOpen(true);
      setInviteEmail('');
  };
  
  const openEditModal = (user) => {
      setIsEditing(true);
      setCurrentUser(user);
      setIsModalOpen(true);
  };
  
  const handleInviteUser = async (e) => {
      e.preventDefault();
      if (!inviteEmail) return;
      try {
          // In a real app, a Cloud Function would trigger on this doc creation
          // to send an actual email with a registration link.
          await addDoc(collection(db, "invites"), {
              email: inviteEmail,
              status: 'pending',
              invitedAt: serverTimestamp()
          });
          alert(`Invite for ${inviteEmail} created. A backend function would now send an email.`);
          setIsModalOpen(false);
      } catch (error) {
          console.error("Error creating invite: ", error);
          alert("Failed to create invite.");
      }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, {
            designation: currentUser.designation,
            reportingTo: currentUser.reportingTo
        });
        setIsModalOpen(false);
        setCurrentUser(null);
    } catch(error) {
        console.error("Error updating user: ", error);
        alert("Failed to update user.");
    }
  };
  
  const handleUserInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentUser(prev => ({ ...prev, [name]: value }));
  }

  const renderModal = () => {
    if (!isModalOpen) return null;

    if (isEditing) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit User: {currentUser.displayName || currentUser.email}</h2>
                <form onSubmit={handleEditUser}>
                  <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium dark:text-gray-300">Designation</label>
                        <select name="designation" value={currentUser.designation} onChange={handleUserInputChange} className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block mb-1 font-medium dark:text-gray-300">Reporting To</label>
                        <select name="reportingTo" value={currentUser.reportingTo} onChange={handleUserInputChange} className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">N/A</option>
                            {users.filter(u => u.id !== currentUser.id).map(u => <option key={u.id} value={u.displayName || u.email}>{u.displayName || u.email}</option>)}
                        </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Invite New User</h2>
                <form onSubmit={handleInviteUser}>
                    <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Enter user's email" required className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    <div className="flex justify-end mt-6 space-x-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Send Invite</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Users</h2>
          <button onClick={openInviteModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">+ Invite User</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reporting To</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading && <tr><td colSpan="5" className="text-center py-4 dark:text-gray-300">Loading users...</td></tr>}
              {!loading && users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.displayName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.designation || 'Not Set'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.reportingTo || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {renderModal()}
    </>
  );
};

export default UserManagementPage;

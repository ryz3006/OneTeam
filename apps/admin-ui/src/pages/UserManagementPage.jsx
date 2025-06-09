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
  
  const projectOptions = useMemo(() => projects.map(p => ({ label: p.name, value: p.id })), [projects]);
  const projectMap = useMemo(() => projects.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {}), [projects]);
  
  const defaultNewUser = { email: '', contactNumber: '', designation: designations.length > 0 ? designations[0] : '', reportingTo: '', mappedProjects: [] };

  useEffect(() => {
    // ... useEffect remains the same
  }, []);
  
  const handleAddUser = async () => {
      if (!currentUser.email) return alert("Email is required.");
      try {
        await addDoc(collection(db, "users"), {
            email: currentUser.email,
            contactNumber: currentUser.contactNumber,
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

        await updateDoc(userRef, {
            contactNumber: currentUser.contactNumber,
            designation: currentUser.designation,
            reportingTo: currentUser.reportingTo,
            mappedProjects: currentUser.mappedProjects,
        });

        // ... rest of the function remains the same
        setIsModalOpen(false);
    } catch(error) { console.error(error); alert("Failed to update user."); }
  };
  
  // ... other functions remain the same

  return (
    <>
      {/* ... main table structure ... */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{isEditing ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <input type="email" name="email" value={currentUser.email} onChange={handleUserInputChange} placeholder="Email" required className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600" disabled={isEditing}/>
                <input type="text" name="contactNumber" value={currentUser.contactNumber || ''} onChange={handleUserInputChange} placeholder="Contact Number" className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                {/* ... other form fields ... */}
              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{isEditing ? 'Save Changes' : 'Add User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementPage;

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// --- Static Data for Dropdowns ---
const amcMsoOptions = ["Not Applicable", "AMC", "MSO"];
const countryOptions = [
    { name: 'India', code: 'IND' }, { name: 'United States', code: 'USA' }, { name: 'United Kingdom', code: 'GBR' },
    { name: 'United Arab Emirates', code: 'ARE' }, { name: 'Singapore', code: 'SGP' }, { name: 'Australia', code: 'AUS' },
    { name: 'Canada', code: 'CAN' }, { name: 'Germany', code: 'DEU' },
];

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time listener for projects
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent spaces in customerName and product
    if (name === 'customerName' || name === 'product') {
        setCurrentProject(prev => ({ ...prev, [name]: value.replace(/\s/g, '') }));
    } else {
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentProject({ name: '', crmId: '', amcMso: amcMsoOptions[0], contractDetails: '', customerName: '', countryCode: countryOptions[0].code, product: '' });
    setIsModalOpen(true);
  };
  
  const openEditModal = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentProject.name || !auth.currentUser) return;
    
    let projectData = { ...currentProject };

    try {
        if (isEditing) {
            const projectRef = doc(db, 'projects', currentProject.id);
            const { id, ...dataToUpdate } = projectData; // Exclude ID from data
            await updateDoc(projectRef, dataToUpdate);
        } else {
            const randomId = Math.floor(100000 + Math.random() * 900000);
            const projectCode = `${projectData.customerName}_${projectData.countryCode}_${projectData.product}_${randomId}`;
            projectData.projectCode = projectCode;

            await addDoc(collection(db, 'projects'), {
                ...projectData,
                createdBy: auth.currentUser.uid,
                createdAt: serverTimestamp()
            });
        }
        setIsModalOpen(false);
        setCurrentProject(null);
    } catch (error) {
      console.error("Error saving project: ", error);
      alert("Error saving project: " + error.message);
    }
  };
  
  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
        try {
            await deleteDoc(doc(db, 'projects', id));
        } catch (error) {
            console.error("Error deleting project: ", error);
        }
    }
  };

  const FormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={currentProject.name || ''} onChange={handleInputChange} placeholder="Project Name" required className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            <input type="text" name="crmId" value={currentProject.crmId || ''} onChange={handleInputChange} placeholder="CRMID (Optional)" className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            <input type="text" name="customerName" value={currentProject.customerName || ''} onChange={handleInputChange} placeholder="Customer Name (no spaces)" required className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            <input type="text" name="product" value={currentProject.product || ''} onChange={handleInputChange} placeholder="Product (no spaces)" required className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            <select name="countryCode" value={currentProject.countryCode} onChange={handleInputChange} className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                {countryOptions.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
             <select name="amcMso" value={currentProject.amcMso} onChange={handleInputChange} className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                {amcMsoOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <textarea name="contractDetails" value={currentProject.contractDetails || ''} onChange={handleInputChange} placeholder="Contract Details" required className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24 md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold">{isEditing ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Projects</h2>
          <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create Project
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CRMID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading && <tr><td colSpan="4" className="text-center py-4 dark:text-gray-300">Loading projects...</td></tr>}
              {!loading && projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{project.projectCode || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project.crmId || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => openEditModal(project)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium">Edit</button>
                    <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <FormModal />}
    </>
  );
};

export default ProjectManagementPage;

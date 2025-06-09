import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', crmId: '', amcMso: '', contractDetails: '' });
  const [loading, setLoading] = useState(false);

  // Real-time listener for projects
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        createdAt: serverTimestamp()
      });
      setNewProject({ name: '', crmId: '', amcMso: '', contractDetails: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding project: ", error);
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

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Projects</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create Project
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CRMID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AMC/MSO</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading && <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>}
              {!loading && projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project.crmId || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project.amcMso}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                    <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Create New Project</h2>
            <form onSubmit={handleAddProject}>
              <div className="space-y-4">
                <input type="text" name="name" value={newProject.name} onChange={handleInputChange} placeholder="Project Name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                <input type="text" name="crmId" value={newProject.crmId} onChange={handleInputChange} placeholder="CRMID (Optional)" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                <input type="text" name="amcMso" value={newProject.amcMso} onChange={handleInputChange} placeholder="AMC/MSO" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                <textarea name="contractDetails" value={newProject.contractDetails} onChange={handleInputChange} placeholder="Contract Details" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24"></textarea>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectManagementPage;

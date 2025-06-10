import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import LogoOnly from '../assets/images/Logo_only.png';

const GoogleIcon = () => ( <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path> <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path> <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path> <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path> </svg> );

const TabButton = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`w-1/2 py-3 text-center font-semibold border-b-2 transition-colors ${active ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>
        {children}
    </button>
);

const CombinedLoginPage = () => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError(''); setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await signOut(auth);
        setError("Access denied. Please contact your administrator to get access.");
      } else {
        const userData = querySnapshot.docs[0].data();
        if (userData.mappedProjects && userData.mappedProjects.length > 0) {
            navigate('/project-selection');
        } else {
            navigate('/no-projects');
        }
      }
    } catch (err) { setError("An error occurred during sign-in."); console.error(err); } 
    finally { setLoading(false); }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const authEmail = username.includes('@') ? username : `${username}@oneteam.local`;
    try {
      const result = await signInWithEmailAndPassword(auth, authEmail, password);
      const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
      if (adminDoc.exists()) {
          window.location.hash = '/admin/dashboard'; // Force navigation to admin
      } else {
          await signOut(auth);
          setError("You do not have administrator privileges.");
      }
    } catch (err) { setError('Invalid admin credentials.'); console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <img src={LogoOnly} alt="OneTeam Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">OneTeam</h1>
        </div>
        
        <div className="flex border-b dark:border-gray-700">
            <TabButton active={activeTab === 'user'} onClick={() => setActiveTab('user')}>User Login</TabButton>
            <TabButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')}>Admin Login</TabButton>
        </div>

        {activeTab === 'user' && (
            <div className="space-y-4">
                 <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex justify-center items-center px-4 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Verifying...' : <><GoogleIcon /> Sign in with Google</>}
                </button>
            </div>
        )}

        {activeTab === 'admin' && (
            <form className="space-y-4" onSubmit={handleAdminLogin}>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? 'Logging in...' : 'Admin Login'}
              </button>
            </form>
        )}
        {error && <p className="text-sm text-red-500 text-center pt-2">{error}</p>}
      </div>
    </div>
  );
};

export default CombinedLoginPage;

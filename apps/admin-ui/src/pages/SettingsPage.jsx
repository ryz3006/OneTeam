import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

const SettingsPage = () => {
    const [countries, setCountries] = useState([]);
    const [newCountry, setNewCountry] = useState({ name: '', code: '' });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'countries'), (doc) => {
            if (doc.exists()) {
                setCountries(doc.data().list || []);
            }
        });
        return unsubscribe;
    }, []);

    const handleAddCountry = async (e) => {
        e.preventDefault();
        if (!newCountry.name || !newCountry.code) return;
        const updatedCountries = [...countries, newCountry];
        try {
            await setDoc(doc(db, 'settings', 'countries'), { list: updatedCountries });
            setNewCountry({ name: '', code: '' });
            setMessage('Country added successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to add country.');
        }
    };

    const handleDeleteCountry = async (codeToDelete) => {
        const updatedCountries = countries.filter(c => c.code !== codeToDelete);
        try {
            await setDoc(doc(db, 'settings', 'countries'), { list: updatedCountries });
            setMessage('Country deleted successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to delete country.');
        }
    };
    
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setMessage('Password should be at least 6 characters.');
            return;
        }
        try {
            await updatePassword(auth.currentUser, newPassword);
            setNewPassword('');
            setConfirmPassword('');
            setMessage('Password updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to update password. You may need to re-login.');
        }
    };

    return (
        <div className="space-y-8">
            {/* Country Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Manage Countries</h2>
                <form onSubmit={handleAddCountry} className="flex items-center gap-4 mb-4">
                    <input type="text" value={newCountry.name} onChange={(e) => setNewCountry({...newCountry, name: e.target.value})} placeholder="Country Name" className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" value={newCountry.code} onChange={(e) => setNewCountry({...newCountry, code: e.target.value.toUpperCase()})} placeholder="3-Letter Code" maxLength="3" className="w-32 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                </form>
                <div className="overflow-y-auto max-h-48">
                    {countries.map(country => (
                        <div key={country.code} className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                            <span className="dark:text-gray-300">{country.name} ({country.code})</span>
                            <button onClick={() => handleDeleteCountry(country.code)} className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Password Reset */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Reset Admin Password</h2>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Reset Password</button>
                </form>
            </div>
            
            {message && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded dark:bg-green-900/50 dark:text-green-300">{message}</div>}
        </div>
    );
};

export default SettingsPage;

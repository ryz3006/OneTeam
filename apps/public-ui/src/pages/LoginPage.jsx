import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in:', result.user);
      // Here you would check if the user exists in your Firestore `users` collection
      // before navigating them to the dashboard.
      navigate('/dashboard');
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div>
      <h1>Public UI - Login</h1>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default LoginPage;

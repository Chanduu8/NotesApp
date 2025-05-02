import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, db } from './FireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../assets/Components/Navbar';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Function to handle the user state update on authentication change
  const handleAuthStateChanged = async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(firebaseUser);
          setRole(userDoc.data().role);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-base font-medium text-gray-700 animate-pulse">
              Loading, please wait...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    // Check if the current location is login page, if yes, don't redirect
    if (location.pathname === '/login') {
      return children; // Allow access to the login page
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, check if they have the required role
  if (Array.isArray(allowedRoles) ? !allowedRoles.includes(role) : role !== allowedRoles) {
    if (role === 'admin') {
      return <Navigate to="/admin/admin-homepage" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default ProtectedRoute;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../auth/FireBaseConfig';

const AddedUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddUser = async () => {
    if (!name || !email || !password) {
      toast.warn('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      toast.warn('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);

      // Create user in Firebase Authentication
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // If Firebase user is created successfully, get the Firebase-generated UID
      const user = userCredential.user;

      // Store user data in Firestore with Firebase UID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role,
      });

      toast.success('User added successfully!');
      
      // Redirect to another page after adding the user
      navigate('/admin/users-details'); // Change this if you want a different redirection.

    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex pt-24 min-h-screen bg-gray-50">
      <div className="w-[20%]"></div>
      <div className="flex-1 flex justify-center items-start">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Add New User</h2>

          <div className="space-y-4">
            <input
              className="border border-gray-300 p-2 w-full rounded-xl"
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              className="border border-gray-300 p-2 w-full rounded-xl"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              className="border border-gray-300 p-2 w-full rounded-xl"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <select
              className="border border-gray-300 p-2 w-full rounded-xl"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={handleAddUser}
              className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-green-500'} text-white font-semibold py-2 hover:bg-green-600 transition rounded-xl`}
              disabled={isLoading}
            >
              {isLoading ? 'Adding User...' : 'Add User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddedUser;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../auth/FireBaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Register = () => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // ✅ Register user with email and password and store data in Firestore
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;

      // ✅ Create user data in Firestore
      const userRef = doc(db, 'users', user.uid); // user.uid is the unique ID from Firebase Auth
      await setDoc(userRef, {
        name: credentials.name, // Store name in Firestore
        email: user.email,
        role: 'user', // default role (can be modified later)
        createdAt: new Date(),
      });

      // Optionally store user data in localStorage for quick access (like in Login)
      localStorage.setItem('loggedInUser', JSON.stringify({
        email: user.email,
        role: 'user', // You can also fetch role dynamically from Firestore if needed
      }));

      toast.success(`Account created for ${user.email}`);
      navigate('/login');  // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-700">REGISTER</h2>
          <p className="text-gray-500 mt-2 text-sm">Create a new account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={credentials.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

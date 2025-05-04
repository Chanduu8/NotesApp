import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../../auth/FireBaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { isMobile } from 'react-device-detect';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle redirect result after Google login on both desktop and mobile
  useEffect(() => {
    let handledRedirect = false;

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && !handledRedirect) {
          handledRedirect = true;
          const user = result.user;
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);

          if (!docSnap.exists()) {
            await setDoc(userRef, {
              email: user.email,
              role: 'user',
              createdAt: serverTimestamp(),
            });
          }

          localStorage.setItem(
            'loggedInUser',
            JSON.stringify({ email: user.email, role: 'user' })
          );

          toast.success(`Welcome USER - ${user.email}`);
          navigate('/user');
        }
      } catch (error) {
        console.error('Redirect login error:', error);
        toast.error('Google redirect login failed.');
      }
    };

    handleRedirectResult();
  }, [navigate]);


  // Listen to authentication state change (added for smoother redirection)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const role = docSnap.data().role;
            localStorage.setItem(
              'loggedInUser',
              JSON.stringify({ email: user.email, role })
            );
            toast.success(`Welcome ${role.toUpperCase()} - ${user.email}`);
            navigate(role === 'admin' ? '/admin/admin-homepage' : '/user');
          }
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('User role not found in Firestore');
      }

      const matchedUserData = docSnap.data();
      const role = matchedUserData.role;

      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({
          email: user.email,
          role,
        })
      );

      toast.success(`Welcome ${role.toUpperCase()} - ${user.email}`);
      navigate(role === 'admin' ? '/admin/admin-homepage' : '/user');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email, password, or role not set.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {

      // For desktop, use the popup method
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: 'user',
          createdAt: serverTimestamp(),
        });
      }

      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ email: user.email, role: 'user' })
      );

      toast.success(`Welcome USER - ${user.email}`);
      navigate('/user');

    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700">LOG IN</h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Please enter your credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-md transition text-sm sm:text-base"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2">
          <div className="h-px bg-gray-300 flex-1"></div>
          <div className="text-gray-400 text-sm">or</div>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2.5 px-4 hover:bg-gray-100 transition text-sm sm:text-base"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <div className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

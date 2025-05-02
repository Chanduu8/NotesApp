import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../auth/FireBaseConfig';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user?.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const homePageByRole = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user?.role) {
      toast.error("You're not logged in!");
      navigate('/');
      return;
    }
    if (user.role.toLowerCase() === 'admin') {
      navigate('/admin/admin-homepage');
    } else {
      navigate('/user');
    }
  };

  const handleSignOut = () => {
    confirmAlert({
      title: 'Confirm Sign Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await signOut(auth);
              localStorage.removeItem('loggedInUser');
              toast.success("Signed out successfully!");
              navigate('/login');
            } catch (error) {
              console.error('Error signing out:', error);
              toast.error("Error signing out. Try again!");
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.info("Sign out cancelled")
        }
      ]
    });
  };

  return (
    <>
      {/* Top Bar (Mobile Only) */}
      <div className="md:hidden bg-white dark:bg-gray-900 shadow px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <span className="text-xl font-semibold text-gray-800 dark:text-white">Notes Collection</span>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-gray-900 border-r dark:border-gray-600
        transform transition-transform duration-300 ease-in-out
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:w-1/5 w-full`}>
        <div className="flex flex-col justify-between h-full pt-16 md:pt-4 p-4">
          <div>
            <div className="hidden md:flex items-center space-x-3 mb-6">
              <span className="text-2xl font-semibold dark:text-white">Notes Collection</span>
            </div>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <button
                  onClick={() => {
                    homePageByRole();
                    setMenuOpen(false); // close drawer on mobile
                  }}
                  className="block w-full text-left py-2 px-4 text-white bg-blue-700 rounded-md hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Home Page
                </button>
              </li>

              {isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-4 text-gray-900 rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      Admin
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/users-details"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-4 text-gray-900 rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;

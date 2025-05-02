import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center bg-white shadow-xl p-10 rounded-3xl">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Notes Collection App</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome! Save, manage, and organize your notes seamlessly. Whether you're a user or an admin, we've got you covered.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg transition">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-full text-lg transition">
              Sign Up
            </button>
          </Link>
          {/* <button
            onClick={handleDashboardRedirect}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg transition"
          >
            Go to Dashboard
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Home;

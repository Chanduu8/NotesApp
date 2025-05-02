import React from 'react';
import Navbar from '../Components/Navbar';

const AdminHomePage = () => {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Left: Navbar takes full width on mobile, fixed width on desktop */}
      <div className="w-full sm:w-1/5 bg-white shadow-md sm:block hidden">
        <Navbar />
      </div>

      {/* Right: Main content takes full width on mobile and 80% on desktop */}
      <div className="w-full sm:w-4/5 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 p-4 mt-12 sm:mt-0 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl text-center flex flex-col justify-center items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">Welcome Admin</h1>
          
          {/* Smaller font size for the paragraph */}
          <p className="text-sm sm:text-base text-gray-700 mb-6">
            This is the Admin Dashboard Home. Here you can manage users, view and delete notes, and add new users to the system.
          </p>

          {/* Adjusted button sizes for smaller screens */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/admin/users-details" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
              Manage Users
            </a>
            <a href="/admin/add-user" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base">
              Add New User
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

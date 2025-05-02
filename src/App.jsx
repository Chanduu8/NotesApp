import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './assets/Pages/HomePage';
import Login from './assets/Pages/Login';
import Register from './assets/Pages/Ragister'; // Typo "Ragister" ko "Register" karo future me
import UserDashboard from './assets/Pages/UserDashboard';
import AdminDashboard from './assets/Pages/AdminDashboard';
import CreateNote from './assets/Pages/CreateNote';
import EditNote from './assets/Pages/EditNote';
import DeleteNote from './assets/Pages/DeleteNote';
import DeletedNotes from './assets/Components/Admin/DeletedNotes';
import UsersDetails from './assets/Components/Admin/UsersDetails';
import AddedUser from './assets/Components/Admin/AddedUser';
import AdminHomePage from './assets/Pages/AdminHomePage';
import UserHomePage from './assets/Pages/UserHomePage';

import ProtectedRoute from './auth/protectedRoute';
import UpdateUserPermissions from './assets/Components/Admin/UpdateuserPermissions';

const App = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={
        <ProtectedRoute publicRoute={true}>
          <HomePage />
        </ProtectedRoute>
      } />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/admin-homepage" element={
        <ProtectedRoute allowedRoles="admin">
          <AdminHomePage />
        </ProtectedRoute>
      } />

      <Route path="/admin/users-details" element={
        <ProtectedRoute allowedRoles="admin">
          <UsersDetails />
        </ProtectedRoute>
      } />

{/* <Route path="/admin/update-permissions" element={
  <ProtectedRoute allowedRoles="admin">
    <UpdateUserPermissions />
  </ProtectedRoute>
} /> */}


      {/* <Route path="/admin/add-user" element={
        <ProtectedRoute allowedRoles="admin">
          <AddedUser />
        </ProtectedRoute>
      } /> */}

      {/* User Routes */}
      <Route path="/user" element={
        <ProtectedRoute allowedRoles="user">
          <UserDashboard />
        </ProtectedRoute>
      } />

      <Route path="/user/user-homepage" element={
        <ProtectedRoute allowedRoles="user">
          <UserHomePage />
        </ProtectedRoute>
      } />

<Route path="/user/create" element={
  <ProtectedRoute allowedRoles={["user", "admin"]}>
    <CreateNote />
  </ProtectedRoute>
} />

      <Route path="/user/edit/:id" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <EditNote />
        </ProtectedRoute>
      } />

      <Route path="/user/delete" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <DeleteNote />
        </ProtectedRoute>
      } />

      <Route path="/user/deleted-notes" element={
        <ProtectedRoute allowedRoles="user">
          <DeletedNotes />
        </ProtectedRoute>
      } />

      {/* Fallback - Agar koi unknown route aaya toh homepage dikhao */}
      <Route path="*" element={
        <ProtectedRoute publicRoute={true}>
          <HomePage />
        </ProtectedRoute>
      } />

    </Routes>
  );
};

export default App;

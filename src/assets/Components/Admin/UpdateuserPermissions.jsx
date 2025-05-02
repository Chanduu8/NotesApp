import React, { useEffect, useState } from 'react';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../auth/FireBaseConfig';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';

const UpdateUserPermissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true); // Start loading state
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const togglePermission = async (userId, currentValue) => {
    try {
      const userRef = doc(db, 'users', userId);
      const updatedPermission = !currentValue;
      await updateDoc(userRef, {
        canViewOthersNotes: updatedPermission,
      });

      // Optimistically update UI
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, canViewOthersNotes: updatedPermission }
            : user
        )
      );

      toast.success(`Permission ${updatedPermission ? 'granted' : 'revoked'} successfully!`);
    } catch (error) {
      console.error('Error updating permission', error);
      toast.error('Failed to update permission');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 border-r">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="w-4/5 p-8 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Manually Update User Permissions</h2>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Permission</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.name || 'Unnamed'}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    {user.canViewOthersNotes ? ' Yes' : ' No'}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => togglePermission(user.id, user.canViewOthersNotes)}
                      className={`px-3 py-1 rounded text-white transition ${
                        user.canViewOthersNotes ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {user.canViewOthersNotes ? 'Revoke' : 'Grant'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UpdateUserPermissions;

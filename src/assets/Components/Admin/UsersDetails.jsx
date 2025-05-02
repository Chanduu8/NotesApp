import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../auth/FireBaseConfig';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsersFromFirestore();
  }, []);

  const fetchUsersFromFirestore = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      toast.error('Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
      });

      setAllUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Error updating user role');
      console.error('Error updating user role:', error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 md:p-8 mx-auto lg:mr-30 " style={{ width: '80%', maxWidth: '1200px' }}>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">All Registered Users</h2>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {allUsers.length === 0 ? (
              <div className="text-center text-gray-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-xs sm:text-sm text-gray-600 uppercase">
                      <th className="py-2 px-4 sm:py-3 sm:px-6">Email</th>
                      <th className="py-2 px-4 sm:py-3 sm:px-6">Role</th>
                      <th className="py-2 px-4 sm:py-3 sm:px-6">Name</th>
                      <th className="py-2 px-4 sm:py-3 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr key={user.id} className="border-t text-xs sm:text-sm text-gray-700">
                        <td className="py-2 px-4 sm:px-6 break-all">{user.email}</td>
                        <td className="py-2 px-4 sm:px-6 capitalize">{user.role}</td>
                        <td className="py-2 px-4 sm:px-6">{user.name || 'N/A'}</td>
                        <td className="py-2 px-4 sm:px-6 text-right">
                          <select
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UserDetails;

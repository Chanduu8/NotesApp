import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { db, auth } from '../../../auth/FireBaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const DeletedNotes = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);

        try {
          const q = query(
            collection(db, 'deletedNotes'),
            where('email', '==', user.email)
          );
          const querySnapshot = await getDocs(q);

          const notes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setDeletedNotes(notes);
        } catch (error) {
          console.error('Error fetching deleted notes:', error);
        }
      } else {
        console.warn('No user logged in.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 mx-auto"></div>
          <p className="mt-4 text-base font-medium text-gray-700 animate-pulse">
            Loading deleted notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col sm:flex-row">
      {/* Navbar for small & large screens */}
      <div className="sm:w-1/5 w-full sm:block mb-4 sm:mb-0">
        <Navbar />
      </div>

      <div className="sm:w-4/5 w-full pt-20 sm:pt-28 px-4 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-red-600 text-center sm:text-left">
          Deleted Notes (by Admin)
        </h1>

        {deletedNotes.length > 0 ? (
          deletedNotes.map((note) => (
            <div
              key={note.id}
              className="border border-red-300 bg-red-50 p-4 mb-4 rounded shadow-sm"
            >
              <p className="text-gray-800 mb-2 break-words">{note.content}</p>
              <p className="text-sm text-red-700 mb-1">Reason: {note.reason}</p>
              <p className="text-xs text-gray-500">
                Deleted at: {note.deletedAt?.toDate().toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 italic">
                Deleted by: Administrator Of Application.
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center sm:text-left">
            No deleted notes found for your account.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeletedNotes;

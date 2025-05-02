import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { db, auth } from '../../auth/FireBaseConfig';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { FiCopy } from 'react-icons/fi';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }

      try {
        const userQuery = query(collection(db, 'users'), where('email', '==', currentUser.email));
        const userSnapshot = await getDocs(userQuery);
      
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserName(userData.name || currentUser.email);
        } else {
          // Fallback to Firebase Auth displayName or email
          setUserName(currentUser.displayName || currentUser.email);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName(currentUser.displayName || currentUser.email);
      }
      
      const notesQuery = query(
        collection(db, 'notes'),
        where('email', '==', currentUser.email),
        orderBy('createdAt', 'desc')
      );

      const unsubscribeNotes = onSnapshot(notesQuery, (snapshot) => {
        const notesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesList);
        setLoading(false);
      });

      return () => unsubscribeNotes();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleDelete = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen">
      {/* Navbar */}
      <div className="md:w-1/5 w-full">
        <Navbar />
      </div>

      {/* Dashboard Content */}
      <div className="md:ml-[20%] w-full flex-grow p-4 md:p-6 mt-16 md:mt-6">

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-5">
            Welcome To The NoteBook Dashboard
            <br />
            <span className="text-blue-600">{userName}</span>!!!
          </h1>

          <p className="mb-6 text-sm md:text-base">You can Create, Edit, and Delete your Notes.</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition text-sm md:text-base"
              onClick={() => navigate('/user/create')}
            >
              Create New Note
            </button>

            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-400 transition text-sm md:text-base"
              onClick={() => {
                if (notes.length > 0) {
                  navigate(`/user/edit/${notes[0].id}`);
                } else {
                  toast.warn('No notes to edit!');
                }
              }}
            >
              Edit Your Notes
            </button>

            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition text-sm md:text-base"
              onClick={() => navigate('/user/delete')}
            >
              Delete Your Notes
            </button>

            <button
              className="bg-green-300 text-white py-2 px-4 rounded hover:bg-green-400 transition text-sm md:text-base"
              onClick={() => navigate('/user/deleted-notes')}
            >
              View Deleted Notes
            </button>
          </div>
        </div>

        {/* User Notes */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg md:text-xl font-bold mb-4">Your Notes:</h3>

          {notes.length === 0 ? (
            <div className="bg-white border rounded p-4 mb-3 shadow-sm text-gray-500 font-semibold text-center">
              Cannot find any notes.
              <br />
              Create one!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="relative bg-white border rounded p-4 mb-3 shadow-md"
              >
                <FiCopy
                  className="absolute top-3 right-3 text-gray-500 hover:text-blue-500 cursor-pointer"
                  size={20}
                  title="Copy to clipboard"
                  onClick={() => {
                    navigator.clipboard.writeText(note.content);
                    toast.success("Copied to clipboard!");
                  }}
                />

                <p className="text-left whitespace-pre-wrap pr-8 text-sm md:text-base">{note.content}</p>

                <div className="text-xs text-gray-500 mt-2">
                  Last updated: {formatTimestamp(note.updatedAt)}
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => navigate(`/user/edit/${note.id}`)}
                    className="bg-yellow-500 text-white text-xs px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

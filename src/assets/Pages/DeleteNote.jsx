import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../auth/FireBaseConfig';
import { toast } from 'react-toastify';

const UserDeleteNote = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (!currentUser) {
      toast.error('You must be logged in');
      navigate('/');
      return;
    }

    const q = query(collection(db, 'notes'), where('email', '==', currentUser.email));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(userNotes);
    }, (error) => {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    });

    return () => unsubscribe();
  }, [navigate, currentUser]);

  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this note?');
    if (!confirmDelete) return;

    try {
      const noteRef = doc(db, 'notes', noteId);
      await deleteDoc(noteRef);

      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Delete Your Notes</h1>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">No notes found.</p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="bg-white border rounded p-4 mb-4 shadow-sm flex flex-col sm:flex-row justify-between gap-3"
            >
              <p className="whitespace-pre-wrap break-words text-sm sm:text-base flex-1">{note.content}</p>
              <button
                onClick={() => handleDelete(note.id)}
                className="self-end sm:self-center bg-red-500 text-white text-xs px-4 py-1.5 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserDeleteNote;

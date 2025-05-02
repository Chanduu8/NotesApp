import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../auth/FireBaseConfig';
import { toast } from 'react-toastify';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchNote = async () => {
      const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

      if (!currentUser) {
        toast.error('You must be logged in');
        navigate('/');
        return;
      }

      try {
        const noteRef = doc(db, 'notes', id);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) {
          const noteData = noteSnap.data();
          if (noteData.email === currentUser.email) {
            setNoteText(noteData.content);
            setLastUpdated(
              noteData.updatedAt
                ? noteData.updatedAt.toDate().toLocaleString()
                : null
            );
            setTimeout(() => textAreaRef.current?.focus(), 100);
          } else {
            toast.error("You can't edit someone else's note.");
            navigate('/user');
          }
        } else {
          toast.error('Note not found');
          navigate('/user');
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Something went wrong');
        navigate('/user');
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const trimmedText = noteText.trim();
    if (!trimmedText) return toast.warn("Note can't be empty!");

    try {
      const noteRef = doc(db, 'notes', id);
      const updatedAt = new Date();
      await updateDoc(noteRef, {
        content: trimmedText,
        updatedAt,
      });
      toast.success('Note updated successfully!');
      navigate('/user');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
          Edit Note
        </h1>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <textarea
            ref={textAreaRef}
            className="w-full border rounded p-3 min-h-[150px] resize-none focus:ring-2 focus:ring-yellow-400"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button
            type="submit"
            className="self-center sm:self-start bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
          >
            Update Note
          </button>
        </form>

        {lastUpdated && (
          <div className="mt-4 text-sm text-gray-500 text-center sm:text-left">
            Last updated on: {lastUpdated}
          </div>
        )}
      </div>
    </>
  );
};

export default EditNote;

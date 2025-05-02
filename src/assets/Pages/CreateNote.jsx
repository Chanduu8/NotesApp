import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../Components/Navbar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { db } from '../../auth/FireBaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FiCopy } from 'react-icons/fi';

const CreateNote = () => {
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const notesRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    if (userData?.role) {
      setRole(userData.role);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!noteText.trim()) {
      toast.warning('Please write something!');
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser?.email) {
      toast.error("User not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "notes"), {
        content: noteText.trim(),
        email: currentUser.email,
        createdAt: new Date(),
      });

      toast.success("Note Created Successfully!");
      setNoteText('');

      navigate(role === 'admin' ? '/admin' : '/user');
    } catch (error) {
      console.error("Error saving note to Firestore:", error);
      toast.error("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback(() => {
    if (notesRef.current && noteText.length > 0) {
      notesRef.current.select();
      notesRef.current.setSelectionRange(0, noteText.length);
      window.navigator.clipboard.writeText(noteText).then(() => {
        toast.success("Copied to clipboard!");
      });
    } else {
      toast.warn('No Notes Are Available To Copy!');
    }
  }, [noteText]);

  return (
    <>
      <Navbar />

      <div className="pt-24 sm:pt-32 md:pt-40 max-w-xl mx-auto px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">
          Create a New Note
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              ref={notesRef}
              className="w-full border border-gray-300 rounded p-3 pr-10 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
              rows={5}
              placeholder="Write your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />

            <FiCopy
              onClick={copyToClipboard}
              className="absolute top-3 right-3 text-gray-600 hover:text-blue-500 cursor-pointer"
              size={20}
              title="Copy to clipboard"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white px-6 py-2 rounded text-sm sm:text-base transition ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateNote;

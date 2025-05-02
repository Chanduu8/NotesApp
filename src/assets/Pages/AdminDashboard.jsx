import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { db } from '../../auth/FireBaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { FiCopy } from 'react-icons/fi';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AdminDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      const user = JSON.parse(userData);
      setAdminEmail(user.email || '');
    }

    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notes'));
      const notesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesList);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    }
  };

  const handleDeleteNote = (noteId, noteData) => {
    let reason = '';
  
    confirmAlert({
      title: 'Delete Note',
      message: 'Please provide a reason before deleting this note:',
      customUI: ({ onClose }) => {
        return (
          <div className="react-confirm-alert-body p-4 rounded bg-white shadow-lg border border-red-200 w-full max-w-sm mx-auto">
            <h1 className="text-lg font-bold text-red-600 mb-3">Delete Note</h1>
            <p className="text-sm mb-2">Enter reason for deleting this note:</p>
            <input
              type="text"
              onChange={(e) => (reason = e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4 text-sm"
              placeholder="Enter reason here..."
            />
            <div className="flex flex-col gap-2 mt-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition w-full text-sm"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full text-sm"
                onClick={async () => {
                  if (!reason.trim()) {
                    toast.warning('Reason is required!');
                    return;
                  }
  
                  try {
                    await addDoc(collection(db, 'deletedNotes'), {
                      ...noteData,
                      deletedAt: Timestamp.now(),
                      reason: reason.trim(),
                      deletedBy: adminEmail,
                    });
  
                    await deleteDoc(doc(db, 'notes', noteId));
  
                    toast.success('Note deleted successfully.');
                    onClose();
                    fetchNotes();
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to delete note');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      },
    });
  };
  
  

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return 'N/A';
    return timestamp.toDate().toLocaleString();
  };

  const personalNotes = notes.filter((note) => note.email === adminEmail);
  const userNotes = notes.filter((note) => note.email !== adminEmail);

  const handleDelete = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success('Note deleted successfully!');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleUpdateNote = async (noteId, noteContent) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        content: noteContent,
        updatedAt: Timestamp.now(),
      });
      toast.success('Note updated successfully!');
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Dashboard */}
      <div className="flex-grow p-6 overflow-y-auto mt-12 sm:mt-16 md:mt-20 lg:ml-90">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-18 text-gray-800">
            Admin Dashboard
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              className="bg-blue-600 text-white py-2 px-5 rounded-lg shadow hover:bg-blue-500 transition"
              onClick={() => navigate('/user/create')}
            >
              + Create New Note
            </button>
          </div>

          {/* Personal Notes */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Your Personal Notes</h2>
            {personalNotes.length === 0 ? (
              <p className="text-gray-500">No personal notes found.</p>
            ) : (
              <div className="space-y-4">
                {personalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="relative bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
                  >
                    <FiCopy
                      className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 cursor-pointer"
                      size={20}
                      title="Copy to clipboard"
                      onClick={() => {
                        navigator.clipboard.writeText(note.content);
                        toast.success('Copied to clipboard!');
                      }}
                    />
                    <p className="text-gray-700 whitespace-pre-wrap pr-8">{note.content}</p>
                    <p className="text-xs text-right text-gray-400 mt-2">
                      Created at: {formatTimestamp(note.createdAt)}
                    </p>
                    <p className="text-xs text-right text-gray-400 mt-2">
                      Last updated: {formatTimestamp(note.updatedAt)}
                    </p>

                    <div className="flex gap-x-2 mt-3">
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
                ))}
              </div>
            )}
          </div>

          {/* All User Notes */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">All User Notes</h2>
            {userNotes.length === 0 ? (
              <p className="text-gray-500">No user notes available.</p>
            ) : (
              <div className="space-y-4">
                {userNotes.map((note) => (
                  <div
                    key={note.id}
                    className="relative bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
                  >
                    <FiCopy
                      className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 cursor-pointer"
                      size={20}
                      title="Copy to clipboard"
                      onClick={() => {
                        navigator.clipboard.writeText(note.content);
                        toast.success('Copied to clipboard!');
                      }}
                    />
                    <p className="text-gray-700 whitespace-pre-wrap pr-8">{note.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Created by: <span className="text-blue-600">{note.email}</span> <br />
                      {formatTimestamp(note.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last updated: {formatTimestamp(note.updatedAt)}
                    </div>
                    <div className="flex gap-x-2 mt-3">
                      <button
                        onClick={() => handleDeleteNote(note.id, note)}
                        className="bg-red-500 text-white text-xs px-4 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete with Reason
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

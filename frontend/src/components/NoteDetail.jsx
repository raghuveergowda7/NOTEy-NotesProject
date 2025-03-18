import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import './NoteDetail.css';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, deleteNote } = useNotes();
  const note = getNote(id);

  if (!note) {
    return <div>Note not found</div>;
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  return (
    <div className="note-detail">
      <div className="note-header">
        <h1>{note.title}</h1>
        <div className="note-actions">
          <button
            className="btn-edit"
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="note-content">
        <div 
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>

      {note.image && (
        <div className="note-image">
          <img src={note.image} alt="Note attachment" />
        </div>
      )}

      {note.drawing && (
        <div className="note-drawing">
          <img src={note.drawing} alt="Note drawing" />
        </div>
      )}
    </div>
  );
};

export default NoteDetail; 
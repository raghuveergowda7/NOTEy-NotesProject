import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import RichTextEditor from './RichTextEditor';
import './NoteForm.css';

const NoteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNote, updateNote, getNote } = useNotes();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    drawing: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [drawingUrl, setDrawingUrl] = useState(null);

  useEffect(() => {
    if (id) {
      const note = getNote(id);
      if (note) {
        setFormData({
          title: note.title,
          content: note.content,
          image: note.image,
          drawing: note.drawing,
        });
        setPreviewUrl(note.image);
        setDrawingUrl(note.drawing);
      }
    }
  }, [id, getNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrawingChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        drawing: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setDrawingUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    if (formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    }
    if (formData.drawing instanceof File) {
      formDataToSend.append('drawing', formData.drawing);
    }

    try {
      if (id) {
        await updateNote(id, formDataToSend);
      } else {
        await addNote(formDataToSend);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="note-form">
      <h2>{id ? 'Edit Note' : 'Create New Note'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <RichTextEditor
            content={formData.content}
            onChange={handleContentChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="drawing">Drawing</label>
          <input
            type="file"
            id="drawing"
            name="drawing"
            accept="image/*"
            onChange={handleDrawingChange}
          />
          {drawingUrl && (
            <div className="drawing-preview">
              <img src={drawingUrl} alt="Drawing Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {id ? 'Update Note' : 'Create Note'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm; 
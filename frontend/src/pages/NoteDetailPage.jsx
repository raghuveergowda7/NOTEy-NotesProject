import { useEffect, useState } from "react";
import { BiSolidTrashAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { FaFileExport, FaFilePdf, FaFileWord, FaFileAlt, FaPaintBrush } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import "./NoteDetailPage.css";
import axios from "axios";
import { FormatDate } from "../components/FormatDate";
import Modal from "../components/Modal";
import showToast from "../utils/toastConfig";
import { exportToPDF, exportToWord, exportToMarkdown } from "../utils/exportUtils";
import DrawingCanvas from "../components/DrawingCanvas";

const NoteDetailPage = ({ deleteNote }) => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { slug } = useParams();

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteNote(slug);
      showToast.success("Note deleted successfully");
    } catch (error) {
      console.error('Error deleting note:', error);
      showToast.error("Failed to delete note");
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8008/notes/${slug}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log('Note data received:', {
          ...res.data,
          image: res.data.image,
          drawing: res.data.drawing
        });
        setNote(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading note:', err);
        showToast.error("Failed to load note");
        setLoading(false);
      });
  }, [slug]);

  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => (
      line.trim() ? <p key={index} className="mb-3">{line}</p> : <br key={index} />
    ));
  };

  const handleDrawingSave = async (blob) => {
    try {
      const formData = new FormData();
      const file = new File([blob], 'drawing.png', { type: 'image/png' });
      formData.append('drawing', file);
      
      const response = await axios.patch(
        `http://127.0.0.1:8008/notes/${slug}/`,
        formData,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setNote(response.data);
      setShowDrawing(false);
      showToast.success('Drawing saved successfully!');
    } catch (error) {
      console.error('Error saving drawing:', error);
      showToast.error('Failed to save drawing');
    }
  };

  const handleExport = async (exportFn, type) => {
    try {
      setExporting(true);
      await exportFn(note);
      showToast.success(`Note exported as ${type} successfully!`);
    } catch (error) {
      console.error(`Error exporting as ${type}:`, error);
      showToast.error(`Failed to export as ${type}`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!note) {
    return <div className="text-center mt-5">Note not found</div>;
  }

  return (
    <>
      <div className="note-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="title">{note.title}</h3>
        </div>

        <div className="d-flex justify-content-center mb-4">
          <p className="note-date font-12 text-muted me-5">
            Created: {FormatDate(note.created)}
          </p>
          <p className="note-date font-12 text-muted">
            Last updated: {FormatDate(note.updated)}
          </p>
        </div>

        <div className="button-group">
          <Link to={`/edit-note/${slug}`}>
            <button className="btn btn-primary">
              <FiEdit className="me-2" />
              <span>Edit</span>
            </button>
          </Link>

          <button className="btn btn-danger" onClick={handleIsOpen}>
            <BiSolidTrashAlt className="me-2" />
            <span>Delete</span>
          </button>

          <div className="dropdown d-inline-block">
            <button 
              className="btn btn-secondary dropdown-toggle" 
              type="button" 
              id="exportDropdown"
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              disabled={exporting}
            >
              <FaFileExport className="me-2" />
              {exporting ? 'Exporting...' : 'Export'}
            </button>
            <ul className="dropdown-menu" aria-labelledby="exportDropdown">
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => handleExport(exportToPDF, 'PDF')}
                  disabled={exporting}
                >
                  <FaFilePdf className="me-2" /> Export as PDF
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => handleExport(exportToWord, 'Word')}
                  disabled={exporting}
                >
                  <FaFileWord className="me-2" /> Export as Word
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => handleExport(exportToMarkdown, 'Markdown')}
                  disabled={exporting}
                >
                  <FaFileAlt className="me-2" /> Export as Markdown
                </button>
              </li>
            </ul>
          </div>

          <button 
            className="btn btn-info" 
            onClick={() => setShowDrawing(!showDrawing)}
          >
            <FaPaintBrush className="me-2" />
            {showDrawing ? 'Hide Drawing' : 'Add Drawing'}
          </button>
        </div>

        <div className="category-badge mb-4" style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor: note.category === "BUSINESS" ? "#2cd07e20" : 
                         note.category === "PERSONAL" ? "#667eea20" : "#ff505020",
          color: note.category === "BUSINESS" ? "#2cd07e" :
                note.category === "PERSONAL" ? "#667eea" : "#ff5050",
          border: `1px solid ${note.category === "BUSINESS" ? "#2cd07e" :
                              note.category === "PERSONAL" ? "#667eea" : "#ff5050"}`
        }}>
          {note.category}
        </div>

        {showDrawing && (
          <div className="drawing-section mb-4">
            <DrawingCanvas onSave={handleDrawingSave} initialImage={note.drawing} />
          </div>
        )}

        {note.image && (
          <div className="note-image-container mb-4">
            <img 
              src={note.image}
              alt="Uploaded content"
              className="note-image"
              onLoad={() => console.log('Image loaded successfully:', note.image)}
              onError={(e) => {
                console.error('Error loading image:', note.image);
                e.target.style.display = 'none';
                showToast.error('Failed to load image');
              }}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        )}

        {note.drawing && !showDrawing && (
          <div className="drawing-container mb-4">
            <img 
              src={note.drawing}
              alt="Drawing"
              className="note-drawing"
              onLoad={() => console.log('Drawing loaded successfully:', note.drawing)}
              onError={(e) => {
                console.error('Error loading drawing:', note.drawing);
                e.target.style.display = 'none';
                showToast.error('Failed to load drawing');
              }}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        )}

        <div className="description">
          <div 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: note.content || note.body }}
          />
        </div>
      </div>

      {isOpen && (
        <Modal
          handleIsOpen={handleIsOpen}
          deleteNote={handleDelete}
        />
      )}
    </>
  );
};

export default NoteDetailPage;

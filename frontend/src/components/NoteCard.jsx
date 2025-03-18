import React from 'react';
import { MdContentCopy, MdShare } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FormatDate } from './FormatDate';
import showToast from "../utils/toastConfig";
import './NoteCard.css';

const NoteCard = ({note}) => {
  const content = note.content || note.body;
  const plainText = content.replace(/<[^>]+>/g, ' ');
  const previewText = `${plainText.split(" ").slice(0, 20).join(" ")} ...`;
  const color = note.category === "BUSINESS" ? "blue" : note.category === "PERSONAL" ? "green" : "purple";

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    showToast.success("Note content copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: plainText,
          url: window.location.href
        });
        showToast.success("Note shared successfully!");
      } catch (error) {
        showToast.error("Failed to share note");
      }
    } else {
      showToast.info("Sharing is not supported on this device");
    }
  };

  return (
    <div className="note-card">
      <div className="note-card-content">
        <div className="note-card-header">
          <FaNoteSticky style={{ color: color }} />
          <div className="note-actions">
            <MdContentCopy 
              className="action-icon"
              style={{ color: color }} 
              onClick={handleCopy}
            />
            <MdShare 
              className="action-icon"
              style={{ color: color }} 
              onClick={handleShare}
            />
          </div>
        </div>
        
        <Link to={`/notes/${note.slug}`} className="note-title-link">
          <h5 className="note-title">{note.title}</h5>
        </Link>
        
        <p className="note-date">{FormatDate(note.updated)}</p>
        <div className="note-preview">
          <p className="note-text">{previewText}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
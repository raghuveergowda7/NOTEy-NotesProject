import React, { useState, useEffect } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';
import './ImageUpload.css';
import showToast from "../utils/toastConfig";

const ImageUpload = ({ onImageUpload, initialImage }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialImage) {
      if (initialImage instanceof File) {
        // If it's a File object, create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(initialImage);
      } else {
        // If it's a URL string, use it directly
        setPreviewUrl(initialImage);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [initialImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) {
      console.error('No file provided');
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      showToast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      showToast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      onImageUpload(file);
    };

    reader.onerror = () => {
      console.error('Error reading file');
      showToast.error('Error reading image file');
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageUpload(null);
  };

  return (
    <div className="image-upload-container">
      {!previewUrl ? (
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="file-input"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="upload-label">
            <FaImage className="upload-icon" />
            <span>Drop an image here or click to upload</span>
          </label>
        </div>
      ) : (
        <div className="preview-container">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="image-preview"
            onError={(e) => {
              console.error('Error loading preview image');
              setPreviewUrl(null);
              showToast.error('Error loading image preview');
            }}
          />
          <button className="remove-button" onClick={removeImage}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 
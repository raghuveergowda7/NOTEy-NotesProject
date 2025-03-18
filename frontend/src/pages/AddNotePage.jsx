import React, { useState } from "react";
import "./AddNotePage.css";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import ImageUpload from "../components/ImageUpload";
import { toast } from "react-toastify";

const AddNotePage = ({addNote}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const newNote = {
    title: title,
    body: body,
    category: category,
    image: image
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!title || !body || !category) {
      toast.error("All fields are required");
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('category', category);
    
    if (image) {
      // If image is a base64 string, convert it to a file
      if (typeof image === 'string' && image.startsWith('data:image')) {
        const byteString = atob(image.split(',')[1]);
        const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'image.jpg', { type: mimeString });
        formData.append('image', file);
      } else if (image instanceof File) {
        formData.append('image', image);
      }
    }
    
    console.log('Submitting form data:', {
      title,
      body,
      category,
      image: image ? 'Image present' : 'No image'
    });
    
    addNote(formData);
    navigate("/");
  };

  const handleImageUpload = (imageData) => {
    setImage(imageData);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h5>Add New Note</h5>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          className="form-control"
          id="title"
          placeholder="Enter note's title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          Content
        </label>
        <RichTextEditor
          content={body}
          onChange={setBody}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Note's category
        </label>
        <select
          className="form-select"
          id="category"
          value={category}
          style={{ height: "40px" }}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Pick a category</option>
          <option value="BUSINESS">Business</option>
          <option value="PERSONAL">Personal</option>
          <option value="IMPORTANT">Important</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Image (optional)</label>
        <ImageUpload 
          onImageUpload={handleImageUpload}
          initialImage={image}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary d-flex justify-content-center align-items-center"
        style={{ width: "100%" }}
      >
        Add Note
      </button>
    </form>
  );
};

export default AddNotePage;

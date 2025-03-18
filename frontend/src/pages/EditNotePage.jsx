import { useEffect, useState } from "react";
import "./AddNotePage.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import RichTextEditor from "../components/RichTextEditor";
import ImageUpload from "../components/ImageUpload";

const EditNotePage = ({updateNote}) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "",
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  const { slug } = useParams();
  const navigate = useNavigate();

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
          image: res.data.image ? 'Image present' : 'No image'
        });
        const data = {
          title: res.data.title || "",
          body: res.data.body || "",
          category: res.data.category || "",
          image: res.data.image || null
        };
        setFormData(data);
        setInitialData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading note:', err);
        toast.error("Failed to load note data");
        setLoading(false);
      });
  }, [slug]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasChanges = () => {
    if (!initialData) return false;
    return (
      formData.title !== initialData.title ||
      formData.body !== initialData.body ||
      formData.category !== initialData.category ||
      formData.image !== initialData.image
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if(!formData.title || !formData.body || !formData.category) {
      toast.error("All fields are required");
      return;
    }

    // Check if there are actual changes
    if (!hasChanges()) {
      toast.info("No changes to save");
      navigate(`/notes/${slug}`);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('body', formData.body);
      formDataToSend.append('category', formData.category);
      
      if (formData.image) {
        // If image is a base64 string, convert it to a file
        if (typeof formData.image === 'string') {
          if (formData.image.startsWith('data:image')) {
            const byteString = atob(formData.image.split(',')[1]);
            const mimeString = formData.image.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], 'image.jpg', { type: mimeString });
            formDataToSend.append('image', file);
          } else if (!formData.image.startsWith('http')) {
            // If it's not a URL and not a base64 string, treat it as a new file
            formDataToSend.append('image', formData.image);
          }
        } else if (formData.image instanceof File) {
          formDataToSend.append('image', formData.image);
        }
      } else {
        // If image is null, we need to explicitly send an empty string to clear the image
        formDataToSend.append('image', '');
      }

      console.log('Submitting form data:', {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        image: formData.image ? (
          typeof formData.image === 'string' ? 
            formData.image.startsWith('data:image') ? 'New image (base64)' :
            formData.image.startsWith('http') ? 'Existing image URL' : 'Unknown string'
          : formData.image instanceof File ? 'New image (File)' : 'Unknown type'
        ) : 'No image'
      });
      
      await updateNote(formDataToSend, slug);
      navigate(`/notes/${slug}`);
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error("Failed to update note");
    }
  };

  const handleImageUpload = (imageData) => {
    console.log('Image upload:', imageData ? 'Image received' : 'Image removed');
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h5>Update Note</h5>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          className="form-control"
          id="title"
          placeholder="Enter note's title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          Content
        </label>
        <RichTextEditor
          content={formData.body}
          onChange={(newContent) => handleChange('body', newContent)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Note's category
        </label>
        <select
          className="form-select"
          id="category"
          value={formData.category}
          style={{ height: "40px" }}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">Pick a category</option>
          <option value="BUSINESS">Business</option>
          <option value="PERSONAL">Personal</option>
          <option value="IMPORTANT">Important</option>
        </select>
      </div>

      <ImageUpload 
        onImageUpload={handleImageUpload} 
        initialImage={formData.image}
      />

      <button
        type="submit"
        className="btn btn-primary d-flex justify-content-center align-items-center"
        style={{ width: "100%" }}
        disabled={!hasChanges()}
      >
        {hasChanges() ? "Update Note" : "No Changes"}
      </button>
    </form>
  );
};

export default EditNotePage;

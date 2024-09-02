
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css'; 

const FileUpload = ({ token }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Use navigate for redirection

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
            navigate('/products'); 
        } else {
          alert('Error uploading file: ' + data.message);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Upload Product Data</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input className="upload-input" type="file" onChange={handleFileChange} required />
        <button className="upload-button" type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;

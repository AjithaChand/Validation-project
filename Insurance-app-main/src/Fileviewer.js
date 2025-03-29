import React, { useState } from "react";
import "./Fileviewer.css";

const FileViewer = () => {
  const [fileSrc, setFileSrc] = useState(null);
  const [fileType, setFileType] = useState("");

  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileSrc(e.target.result);
        setFileType(file.type);
      };

      if (file.type.startsWith("image/") || file.type.startsWith("video/") || file.type === "application/pdf") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="file-viewer-container">
      <input type="file" id="fileInput" onChange={handleFileChange} />
      {fileSrc && (
        <div className="file-preview">
          <h2>{fileName}</h2>
          {fileType.startsWith("image/") && <img src={fileSrc} alt="Preview" className="image-preview" />}
          {fileType.startsWith("video/") && (
            <video controls className="video-preview">
              <source src={fileSrc} type={fileType} />
              Your browser does not support the video tag.
            </video>
          )}
          {fileType === "application/pdf" && (
            <iframe src={fileSrc} className="pdf-preview" title={`PDF Preview - ${fileName}`}></iframe>
          )}
          {fileType.startsWith("text/") && <pre className="text-preview">{fileSrc}</pre>}
        </div>
      )}
    </div>
  );
};

export default FileViewer;

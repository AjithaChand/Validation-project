import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Adminpage.css'
import Detailspopup from './Detailspopup';
import { RiDeleteBinFill } from "react-icons/ri";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoIosCloudUpload } from "react-icons/io";
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Adminpage = () => {

  const [file, setFile] = useState(null);

  const handleDownload = () => {
    window.location.href = "http://localhost:8000/download-excel";
  }

  const handleUpload = async () => {

    if (!file) return alert("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload-excel", formData);
      toast.success("File Uploaded Successfully!");
    } catch (err) {
      toast.error("Upload Failed!");
    }

  }

  const [showpopup, setShowpopup] = useState(false)

  const handlePopup = () => {
    setShowpopup(!showpopup)
  }

  const [value, setValue] = useState([])

  // Fetch files from backend
  useEffect(() => {
    axios.get('http://localhost:8000/read')
      .then(res => setValue(res.data))
      .catch(err => console.log(err))
  }, [])

  // Delete values
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/delete/${id}`)
      .then(res => {
        toast.warning("Are you sure you want to delete this data?")
        console.log(res)
        setValue(prev => prev.filter(data => data.id !== id))
      })
      .catch(err => toast.error(err.response.data.error))
  }

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  // Open Modal and Set File URL
  const handleViewFile = (fileUrl) => {
    setSelectedFile(fileUrl);
    setShowModal(true);
  };

  return (
    <div>
      <div>
        <h2>Admin Dashboard</h2>
      </div>
      <div className='row'>
        <div className='col-12'>
          <h4 className='text-center text-white p-4' style={{ paddingTop: "50px" }}>Customer Details</h4>
          <div className='admin-header'>
            <button className='upload-button1' onClick={handleDownload}><PiMicrosoftExcelLogoFill /></button>
            <input type='file' id="fileInput" className='file-input' onChange={(e) => setFile(e.target.files[0])} />
            <label for="fileInput" className="file-label pt-4">
              <span className='label-name'>Choose File</span>
            </label>
            {file && <span className="file-name">{file.name}</span>}
            <button className='upload-button2' onClick={handleUpload}><IoIosCloudUpload /></button>
          </div>
          <table className='mt-5 admin-table' border={1}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Policy</th>
                <th>Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {value.map((data, index) => {
                return <tr key={index}>
                  <td>{data.email}</td>
                  <td>{data.startdate}</td>
                  <td>{data.enddate}</td>
                  <td>{data.policy}</td>
                  <td>
                    {data.file ? (
                      <button
                        className='btn btn-primary'
                        onClick={() => handleViewFile(`http://localhost:8000/${data.file}`)}
                      >
                        View File
                      </button>
                    ) : ("No File")}
                  </td>
                  <td className='delete-button' onClick={() => handleDelete(data.id)}><RiDeleteBinFill /></td>
                </tr>
              })}

            </tbody>
          </table>
          <div className='mt-5'>
            <button className='btn admin-btn' onClick={handlePopup}>Add Details</button>
          </div>
        </div>
      </div>
      <Detailspopup isVisible={showpopup} onClose={handlePopup} />

      {/* Bootstrap Modal for File View */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile ? (
            <iframe
              src={selectedFile}
              title="File Preview"
              width="100%"
              height="500px"
              style={{ border: "none" }}
            ></iframe>
          ) : (
            <p>No file selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
          <ToastContainer position='top-right' autoclose={3000}/>

    </div>
  )
}

export default Adminpage

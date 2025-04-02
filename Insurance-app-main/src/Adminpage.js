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
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from "react-icons/ri";

import { apiurl } from './url';

const Adminpage = () => {
  const [showconfirm, setShowconfirm] = useState(false);
  const role=localStorage.getItem("role");

  const navigate = useNavigate()

  const [value, setValue] = useState([])

  const [file, setFile] = useState(null);

  const handleDownload = () => {
    window.location.href = `${apiurl}/download-excel`;
  }
const handleUpload = async () => {

    if (!file) return toast.error("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${apiurl}/upload-excel`, formData);
      toast.success("File Uploaded Successfully!");
    } catch (err) {
      toast.error("Upload Failed!");
    }

  }

  const [showpopup, setShowpopup] = useState(false)

  const handlePopup = () => {
    setShowpopup(!showpopup)
  }

  // Fetch files from backend
  useEffect(() => {
    axios.get(`${apiurl}/read`)
      .then(res => setValue(res.data))
      .catch(err => console.log(err))
  }, [])

  // Delete values
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      axios.delete(`${apiurl}/delete/customer_details/${id}`)
        .then(res => {
          console.log(res);
          setValue(prev => prev.filter(data => data.id !== id));
          toast.success("Data deleted successfully");
        })
        .catch(err => {
          toast.error(err.response?.data?.error || "An error occurred");
        });
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  //Set File URL
  const handleViewFile = (fileUrl) => {
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'avif'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';

    if (isImage || isPdf) {
      setSelectedFile(`${apiurl}${fileUrl}`);
      setShowModal(true);
    } else {
      toast.error("Unsupported file type");
    }
  };

  const handleLogout = () => {
    setShowconfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/');
  };

  const cancelLogout = () => {
    setShowconfirm(false);
  };

  return (
    <div>
      <div className='adminpage-header p-3'>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className='logout-btn'><span>{role}</span><RiLogoutCircleRLine /></button>
      </div>
     <div className='row'>
        <div className='col-12' style={{ marginTop: "7%" }} >
        <div className="admin-header-container">
  <h3 className="admin-head">Customer Details</h3>
  <div className="admin-header">
    <button className="upload-button1" onClick={handleDownload}>
      <PiMicrosoftExcelLogoFill />
    </button>
    <input
      type="file"
      id="fileInput"
      className="file-input"
      onChange={(e) => setFile(e.target.files[0])}
    />
    <label htmlFor="fileInput" className="file-label">
      <span className="label-name">Choose File</span>
    </label>
    {file && <span className="file-name">{file.name}</span>}
    <button className="upload-button2" onClick={handleUpload}>
      <IoIosCloudUpload />
    </button>
  </div>
</div>
          <table className='mt-5 text-center admin-table'>
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
                  <td>{new Date(data.startdate).toLocaleDateString('en-GB')}</td>
                  <td>{new Date(data.enddate).toLocaleDateString('en-GB')}</td>
                  <td>{data.policy}</td>
                  <td>
                    {data.file_path ? (
                      <button
                        className='btn adminbutton btn-primary'
                        onClick={() => handleViewFile(data.file_path)}
                      >
                        View File
                      </button>
                    ) : ("No File")}
                  </td>
                  <td className='delete-button' onClick={() => handleDelete(data.id)}><RiDeleteBinFill /></td>
                </tr>
              })}
               {/* <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan12@gmail.com</td>
            <td>11/04/205</td>
            <td>13/05/2025</td>
            <td>Medical insurance</td>
            <td>viewfile</td>
            <td><button><RiDeleteBinFill /></button></td>
          </tr> */}
            </tbody>
          </table>
          <div className='mt-4'>
            <button className='btn admin-btn' onClick={handlePopup}>Add Details</button>
          </div>
        </div>
      </div>
      <Detailspopup isVisible={showpopup} onClose={handlePopup} />

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile ? (
            selectedFile.endsWith('.pdf') ? (
              <embed src={selectedFile} type="application/pdf" width="100%" height="600px" />
            ) : (
              <img src={selectedFile} alt="file preview" style={{ width: '100%', height: 'auto' }} />
            )
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
      <ToastContainer position='top-right' autoclose={3000} />
      {showconfirm && (
          <div className='admin-boxhover'>
          <div className="admin-confirmbox">
            <p>Are you sure you want to logout?</p>
            <div className='admin-box'>
            <button className="admin-confirm-btn" onClick={confirmLogout}>Confirm</button>
            <button className="admin-cancel-btn" onClick={cancelLogout}>Cancel</button>
            </div>
            </div>
         
        </div>
      )}
    </div>
  )
}

export default Adminpage

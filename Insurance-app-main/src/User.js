import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';
import Formpopup from './Formpopup';
import Editdialog from './Editdialog';
import { FaEdit } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import { CgProfile } from "react-icons/cg";
// import { RiLogoutCircleRLine } from "react-icons/ri";
// import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from 'react-bootstrap';
import DescriptionIcon from '@mui/icons-material/Description';
// import { IoIosCloudUpload } from "react-icons/io";
import { useContext } from "react";
import { UserContext } from "./usecontext";
import { apiurl } from "./url";
// import UserDialog from './UserDialog';
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';

const User = () => {

  const {shareId} = useContext(UserContext);
  
  // const { userId } = useContext(UserContext);

  console.log("I am from User.jsx", shareId);

  const email = localStorage.getItem('email');

  // const navigate = useNavigate();
  // const username = localStorage.getItem("username");

  const [showedit, setShowEdit] = useState(false);
  const [showform, setShowform] = useState(false);
  // logout
  // const [showconfirm, setShowconfirm] = useState(false);

  const [value, setValue] = useState([]);
  const [selectid, setSelectid] = useState(null);
  


const FetchData = () =>{
  if (email) {
    axios.get(`${apiurl}/data-for-user-edit-by-email/${email}`)
      .then(res => {
        console.log("API Response:", res.data);
        setValue(Array.isArray(res.data) ? res.data : res.data.result || []);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setValue([]); 
      });
  }
}
  useEffect(() => {
    FetchData();
  }, [email]);
  
  console.log(value);          /*==========>> Got Responce*/
  

//   const handleViewFile = (fileUrl) => {
//     if (!fileUrl) {
//       toast.error("No file available");
//       return;
//     }
  
// const completeFileUrl = `${apiurl}${fileUrl}`;
//     console.log("File URL:", completeFileUrl);
  
//     const fileExtension = fileUrl.split('.').pop().toLowerCase();
//     const isImage = ['jpg', 'jpeg', 'png', 'gif', 'avif'].includes(fileExtension);
//     const isPdf = fileExtension === 'pdf';
  
//     if (isImage || isPdf) {
//       setSelectedFile(completeFileUrl);
//       setShowModal(true);
//     } else {
//       toast.error("Unsupported file type");
//     }
//   };
  

  
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
  

  const toggleEdit = (id) => {
    setSelectid(id);
    setShowEdit(!showedit);
  };

  const toggleForm = () => {
    setShowform(!showform);
  };

  // const handleLogout = () => {
  //   setShowconfirm(true);
  // };

  // const confirmLogout = () => {
  //   localStorage.removeItem("authToken");
  //   navigate('/');
  // };

  // const cancelLogout = () => {
  //   setShowconfirm(false);
  // };
 return (
    <div className='user-containerform'>
          {/* <div className='user-profile'>
            <div className='userlogout-btn'><CgProfile /></div>
            <div className='userlogout-btn'>{username}</div>
            <button onClick={handleLogout} className='userlogout-btn'>
              <RiLogoutCircleRLine />
            </button>
          </div> */}
          <div className="admin-headerpage">
            <div >
              <h3 className='text-center head p-3'>USER ENTRY</h3>
            </div>
           
            
          </div>

        <table className='user-table mt-3 text-center'>
          <thead>
            <tr>
              <th >Email</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Policy</th>
              <th>File</th>
              <th>Action</th>
            </tr  >
          </thead>
          <tbody>
          {Array.isArray(value) && value.map((data, index) => (
     <tr key={index}>
    <td>{data.email}</td>
    <td>{new Date(data.startdate).toLocaleDateString("en-CA")}</td>
    <td>{new Date(data.enddate).toLocaleDateString("en-CA")}</td>
    <td>{data.policy}</td>
    <td>
                {data.file_path ? (
                  <button
                    className='adminbutton'
                    onClick={() => handleViewFile(data.file_path)}
                  >
                    <DescriptionIcon style={{ fontSize: 26, color: "green" , cursor: "pointer" }} />
                  </button>
                ) : ("No File")}
              </td>
    <td className='tablerow'>
      <button className='user-edit-btn' onClick={() => toggleEdit(data.id)}>
      <EditIcon sx={{ fontSize: 24, color: 'orange', cursor: 'pointer' }} />
      </button>
    </td>
  </tr>
))}

          </tbody>
        </table>

        {value.length === 0 && (
  <div className='mt-5 userbtn'>
    <button className='btn mt-5 user-btn' onClick={toggleForm}>Add Details</button>
  </div>
)}

        <Formpopup isVisible={showform} onClose={toggleForm} />
        <Editdialog isVisible={showedit} onClose={toggleEdit} userid={shareId} reFresh ={FetchData} />
        {/* <UserDialog  isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} /> */}
        <ToastContainer position='top-right' autoclose={3000} />

        {/* {showModal && selectedFile && (
        <div className="file-modal">
          <div className="modal-content">
            {selectedFile.endsWith(".pdf") ? (
              <iframe src={selectedFile} width="100%" height="500px"></iframe>
            ) : (
              <img src={selectedFile} alt="Uploaded File" style={{ maxWidth: "100%" }} />
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )} */}

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
            <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
};

export default User;
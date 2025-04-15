import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';
import Formpopup from './Dialogbox/Formpopup';
import Editdialog from './Dialogbox/Editdialog';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from 'react-bootstrap';
import DescriptionIcon from '@mui/icons-material/Description';
import { useContext } from "react";
import { UserContext } from "../../usecontext";
import { apiurl } from "../../url";
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';

const User = () => {

  // const [loading ,setLoading] = useState(true)

  const{value,setValue} = useContext(UserContext);

  const { shareId } = useContext(UserContext);

  const { update } = useContext(UserContext)
  const { refreshFromCreate } = useContext(UserContext)

  const {results} = useContext(UserContext);

  console.log("I am from User.jsx", shareId);

  const email = localStorage.getItem('email');

  const [showedit, setShowEdit] = useState(false);
  const [showform, setShowform] = useState(false);

  // const [value, setValue] = useState([]);

const dd = localStorage.getItem("token");
console.log(dd,"kk")

  const FetchData = () => {
    if (email) {
      console.log("For checking email",email);

      // setLoading(true)
      
      axios.get(`${apiurl}/data-for-user-edit-by-email/${email}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      
        .then(res => {
          console.log("API Response:", res.data);
          setValue(Array.isArray(res.data) ? res.data : res.data.result || []);
          console.log("USer page data",res.data.result);
        })
        .catch(err => {
          console.error("Error fetching data:", err);
          setValue([]);
        })
        // .finally(()=>{
        //   setLoading(false)
        // })
    }
  }
  useEffect(() => {
    FetchData();
  }, [email, update, refreshFromCreate]);

  console.log(value);      

  // useEffect(()=>{
  //   if(!loading){
  //     if(value.length===0){
  //       setShowform(true)
  //     }else{
  //       setShowform(false)
  //     }
  //   }
  // },[value,loading])

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  //Set File URL
  const handleViewFile = (fileUrl) => {
    console.log(fileUrl);

    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'avif'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';

    if (isImage || isPdf) {
      setSelectedFile(`${apiurl}${fileUrl}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
        
      );
      setShowModal(true);
    } else {
      toast.error("Unsupported file type");
    }
  };


  const toggleEdit = (id) => {
    // setSelectid(id);
    setShowEdit(!showedit);
  };

  const toggleForm = () => {
    setShowform(!showform);
  };

const handleClick = () =>{
  console.log(results[0]);
  
}
  return (
    <div className='user-containerform'>
      <div className="user-headerpage">
          <h3 className='text-center head mt-5'>USER ENTRY</h3>
      </div>

      <div className='usertable-container'>
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
                    className='userbutton'
                    onClick={() => handleViewFile(data.file_path)}
                  >
                    <DescriptionIcon className="view-btn" />
                  </button>
                ) : ("No File")}
              </td>
              <td className='tablerow'>
                <button className='user-edit-btn' onClick={() => toggleEdit(data.id)} disabled={results[0]?.can_update !== 1}>
                  <EditIcon className='user-editbtn'/>
                </button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      </div>

       {(
        <div className='mt-5 userbtn'>
          <button className='btn mt-5 user-btn' onClick={toggleForm} disabled={results[0]?.can_create !== 1}>Add Details</button>
        </div>
      )}

      <Formpopup isVisible={showform} onClose={toggleForm} />
      <Editdialog isVisible={showedit} onClose={toggleEdit} userid={shareId} />
      <ToastContainer position='top-right' autoclose={3000} />

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
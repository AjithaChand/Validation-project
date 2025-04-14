import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import '../CustomerDetails/Adminpage.css'
import Detailspopup from '../../AdminDashboard/CustomerDetails/Dialogbox/Detailspopup';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoIosCloudUpload } from "react-icons/io";
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { apiurl } from '../../../url';
import UpdateBox from '../../AdminDashboard/CustomerDetails/Dialogbox/updatebox';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from "../../../usecontext";
import Deletebox from '../../AdminDashboard/CustomerDetails/Dialogbox/Deletebox';
import '../../UserDashboard/User.css';
import Formpopup from '../../UserDashboard/Dialogbox/Formpopup';
import Editdialog from '../../UserDashboard/Dialogbox/Editdialog';
import EditIcon from '@mui/icons-material/Edit';


const Adminpage = () => {

  const user = localStorage.getItem('role')

  const { value, setValue ,refreshFromUpdate, refreshCreateFromAdmin ,shareId,update,refreshFromCreate,results} = useContext(UserContext);

  const [deletevalue, setDeletevalue] = useState([])


  const [file, setFile] = useState(null);

  const [showconfirm, setShowconfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null)
  const [showupdate, setShowupdate] = useState(false)
  const [selectid, setSelectid] = useState(null)

  const [refersh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);

  console.log("I am from User.jsx", shareId);

  const email = localStorage.getItem('email');

  const [showedit, setShowEdit] = useState(false);
  const [showform, setShowform] = useState(false);

  const dd = localStorage.getItem("token");
  console.log(dd, "kk")

  const FetchData = () => {
    if (email) {
      console.log("For checking email", email);

      setLoading(true)

      axios.get(`${apiurl}/data-for-user-edit-by-email/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

        .then(res => {
          console.log("API Response:", res.data);
          setValue(Array.isArray(res.data) ? res.data : res.data.result || []);
          console.log("USer page data", res.data.result);
        })
        .catch(err => {
          console.error("Error fetching data:", err);
          setValue([]);
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    FetchData();
  }, [email, update, refreshFromCreate]);

  console.log(value);

  useEffect(() => {
    if (!loading) {
      if (value.length === 0 && user === "user") {
        setShowform(true)
      } else {
        setShowform(false)
      }
    }
  }, [value, loading])

  const toggleEdit = (id) => {
    // setSelectid(id);
    setShowEdit(!showedit);
  };

  const toggleForm = () => {
    setShowform(!showform);
  };

  const handleupdate = (id) => {
    if (id) {
      setSelectid(id);
      setShowupdate(true);
      console.log("Admin page id", id)
    } else {
      setShowupdate(false);
      setSelectid(null);
    }
  };

  const handleDownload = () => {
    window.location.href = `${apiurl}/download-excel`;
  }
  const handleUpload = async () => {

    if (!file) return toast.error("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${apiurl}/upload-excel`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast.success("File Uploaded Successfully!");
      setRefresh(pre => !pre)
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
    axios.get(`${apiurl}/read`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setDeletevalue(res.data))
      .catch(err => console.log(err))
  }, [refersh, refreshFromUpdate, refreshCreateFromAdmin])


  const handleLogout = () => {
    setShowconfirm(true);
  };

  const confirmLogout = () => {
    axios.delete(`${apiurl}/delete/customer_details/${deleteid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        console.log(res);
        cancelLogout();
        toast.success("Data deleted successfully");

        setDeletevalue(prev => prev.filter(data => data.id !== deleteid));
      })
      .catch(err => {
        toast.error(err.response?.data?.error || "An error occurred");
      });
  };

  const cancelLogout = () => {
    setShowconfirm(false);
  };

  // Delete values
  const handleDelete = (id) => {
    console.log("id for delete", id);
    setDeleteid(id);
    handleLogout()
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  //Set File URL
  const handleViewFile = (fileUrl) => {
    console.log("FileUrl", fileUrl);
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    console.log("File Extension", fileExtension);

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'avif'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';

    if (isImage || isPdf) {
      setSelectedFile(`${apiurl}${fileUrl}`);
      setShowModal(true);
    } else {
      toast.error("Unsupported file type");
    }
  };

  return (
    <div>
      {user === 'admin' ? (<>
        <div className='admin-container' >
          <div className="admin-header-container">
            <button className=' admin-btn' onClick={handlePopup}>
              <span className='addbutton'>Add Details <AddIcon className="addicon" /> </span>
            </button>
            <div className="admin-header">
              <button className="upload-button3" onClick={handleDownload}>
                <PiMicrosoftExcelLogoFill />
              </button>
              <input
                type="file"
                id="fileInput"
                className="file-input"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="fileInput" className="file-label">
                <span className="text-white label-name">Choose File</span>
              </label>
              {file && <span className="file-name">{file.name}</span>}
              <button className="upload-button4" onClick={handleUpload}>
                <IoIosCloudUpload />
              </button>
            </div>
          </div>

          <div>
            <p className='tablerow-admin'>CUSTOMER DETAILS</p>
          </div>

          <div className='admintable-container table-div'>
            <table className='text-center admin-table '>
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
                {deletevalue.map((data, index) => {
                    return <tr key={index}>
                      <td>{data.email}</td>
                      <td>{new Date(data.startdate).toLocaleDateString('en-GB')}</td>
                      <td>{new Date(data.enddate).toLocaleDateString('en-GB')}</td>
                      <td>{data.policy}</td>
                      <td>
                        {data.file_path ? (
                          <button
                            className=' adminbutton'
                            onClick={() => handleViewFile(data.file_path)}
                          >
                            <DescriptionIcon className="editicon" />
                          </button>
                        ) : ("No File")}
                      </td>
                      <td>
                        <button className='edit-btn' onClick={() => handleupdate(data?.id)}><FaEdit className='edit-icon' /></button>
                        <button className='delete-button' onClick={() => handleDelete(data.id)}>
                          <DeleteIcon className="deleteicon" />
                        </button>
                      </td>
                    </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>) : user === 'user' ? (<>
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
                        <EditIcon className='user-editbtn' />
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </>) : (<></>)}


      {/* admin page */}
      <Detailspopup isVisible={showpopup} onClose={handlePopup} />
      <UpdateBox onClose={() => handleupdate()} isVisible={showupdate} userid={selectid} />
      <Deletebox isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} />
      <Formpopup isVisible={showform} onClose={toggleForm} />
      <Editdialog isVisible={showedit} onClose={toggleEdit} userid={shareId} />

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
  )
}

export default Adminpage

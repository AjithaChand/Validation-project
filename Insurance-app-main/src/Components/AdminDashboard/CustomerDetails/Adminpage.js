import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import '../CustomerDetails/Adminpage.css'
import Detailspopup from '../../AdminDashboard/CustomerDetails/Dialogbox/Detailspopup';
import { IoCloudUploadOutline } from "react-icons/io5";
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
import { RiFileExcel2Line } from "react-icons/ri";
import { FaHandsHoldingCircle } from "react-icons/fa6";
import { BiSolidNotepad } from "react-icons/bi";
import { PiNotePencilFill } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";

const Adminpage = () => {


  const user = localStorage.getItem('role')

  const { value, setValue, refreshFromUpdate, refreshCreateFromAdmin, shareId, update, refreshFromCreate } = useContext(UserContext);

  //permission code 

  const person_code = localStorage.getItem("person_code")

  console.log(person_code, "Person code from adminpage")

  const [getPermission, setGetPermission] = useState({})


  useEffect(() => {

    if (person_code) {

      axios.get(`${apiurl}/person-code-details?person_code=${person_code}`)

        .then(res => setGetPermission(res.data.info))

        .catch(err => console.log(err.message))

    }


  }, [person_code])

  //


  const [deletevalue, setDeletevalue] = useState([])


  const [file, setFile] = useState(null);

  const [showconfirm, setShowconfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null)
  const [showupdate, setShowupdate] = useState(false)
  const [selectid, setSelectid] = useState(null)

  const [refersh, setRefresh] = useState(true);

  const [adminloading, setAdminloading] = useState(true);

  console.log("I am from User.jsx", shareId);

  const email = localStorage.getItem('email');

  const [showedit, setShowEdit] = useState(false);
  const [showform, setShowform] = useState(false);

  const [search, setSearch] = useState("")

  const [searchbar, setSearchbar] = useState(false)

  const dd = localStorage.getItem("token");
  console.log(dd, "kk")

  const FetchData = () => {
    if (email) {
      console.log("For checking email", email);

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
    }
  }

  useEffect(() => {
    FetchData();
  }, [email, update, refreshFromCreate]);

  console.log(value);

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

  useEffect(() => {
    setAdminloading(true);

    axios.get(`${apiurl}/read`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => {
       setDeletevalue(res.data)
      })
      .catch(console.log)
      .finally(() => setAdminloading(false));
  }, [refersh, refreshFromUpdate, refreshCreateFromAdmin]);
  
  


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

  console.log("selected file ", selectedFile)

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

  const filterData = deletevalue.filter((value) => {
    return value.email?.toLowerCase().includes(search.toLowerCase()) ||
      value.policy?.toLowerCase().includes(search.toLowerCase())
  });

  console.log(filterData, "filterdata");



  return (
    <div>
      <div className='admin-container' >
        <div className='header-container'>
          <div className="admin-header-container">

            <p className='tablerow-admin' >Customer Details</p>

            <div className="admin-header">
              <button className="upload-button3" onClick={handleDownload}>
                <RiFileExcel2Line className='excel-icon' />
              </button>
              <input
                type="file"
                id="fileInput"
                className="file-input"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="fileInput" className="file-label-admin">
                Choose File
              </label>
              {file && <span className="file-name">{file.name}</span>}
              <button className="upload-button4" onClick={handleUpload}>
                <IoCloudUploadOutline className='upload-icon' />
              </button>
            </div>
          </div>
        </div>

        <div className='admin-head-search'>

          <p className='users-count'>Customers Agreements : {filterData.length}</p>

          <div className="searchbar-container">
            <input
              type="text"
              value={search}
              placeholder="Search customer details"
              onChange={(e) => setSearch(e.target.value)}
              className='search-input'
            />
          </div>
          {user === 'admin' ? (
            <button className=' admin-btn' onClick={handlePopup}
            >
              <span className='addbutton'><AddIcon className="addicon" /> Add Details</span>
            </button>
          ) : (
            getPermission.length !== 0 && getPermission[1]?.can_create === 1 && (
              <button className=' admin-btn' onClick={handlePopup}
                disabled={getPermission.length === 0 || getPermission[1]?.can_create !== 1}
              >
                <span className='addbutton'>Add Details <AddIcon className="addicon" /> </span>
              </button>
            )
          )}
        </div>

        <div className='searchbar-res mt-2'>
          <input
            type='text'
            value={search}
            placeholder='Search customer details'
            onChange={(e) => setSearch(e.target.value)}
            className='search-input-res'
          />
        </div>

        <div className='table-container-admin'>
          {adminloading ? (
            <div className='spinner'></div>
          ) : (
            <>
              <div className='container-fluid'>
                <div className='row mt-2'>
                  {filterData.map((values, index) => (
                    <div key={index} className='users-details col-12 col-sm-6 col-md-4 col-lg-6 col-xl-4' >
                      <div className='card  users-details-container'>
                        <div className='card-body'>
                          <div className='profile-admin'>
                            <div><FaUserEdit  /></div>
                            <div className='profile-data'>
                              <div className='profile-email'>{values.email}</div>
                              <div className='profile-date'>{new Date(values.startdate).toLocaleDateString('en-GB')}-{new Date(values.enddate).toLocaleDateString('en-GB')}</div>
                              <div className='profile-policy'>Policy : {values.policy}</div>
                            </div>
                          </div>
                          <hr />
                          <div className='action-icons'>
                            <div className='file-head'>
                              {values.file_path ? (
                                <button
                                  className=' adminbutton'
                                  onClick={() => handleViewFile(values.file_path)}
                                >
                                  {/* <DescriptionIcon className="editicon" /> */}
                                  View File
                                </button>
                              ) : ("No File")}
                            </div>
                            <div>
                              {user === 'admin' ? (
                                <>
                                  <button
                                    className='edit-btn'
                                    onClick={() => handleupdate(values?.id)}
                                  >
                                    <FaEdit className='edit-icon' />
                                  </button>

                                  <button className='delete-button'
                                    onClick={() => handleDelete(values.id)}
                                  >
                                    <DeleteIcon className="deleteicon" />
                                  </button>
                                </>
                              ) : (
                                getPermission.length !== 0 && (getPermission[1]?.can_update === 1 || getPermission[1]?.can_delete === 1) && (
                                  <>
                                    <button
                                      className='edit-btn'
                                      onClick={() => handleupdate(values?.id)}
                                      disabled={getPermission.length === 0 || getPermission[1]?.can_update !== 1}
                                    >
                                      {getPermission.length !== 0 && getPermission[1]?.can_update === 1 && (
                                        <FaEdit className='edit-icon' />
                                      )}
                                    </button>

                                    <button className='delete-button'
                                      onClick={() => handleDelete(values.id)}
                                      disabled={getPermission.length === 0 || getPermission[1]?.can_delete !== 1}
                                    >
                                      {getPermission.length !== 0 && getPermission[1]?.can_delete === 1 && (
                                        <DeleteIcon className="deleteicon" />
                                      )}
                                    </button>
                                  </>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {adminloading === false && filterData.length === 0 && (
            <h6 className='user-msg'> No User Found</h6>
          )}

        </div>

      </div>

      <Detailspopup isVisible={showpopup} onClose={handlePopup} />
      <UpdateBox onClose={() => handleupdate()} isVisible={showupdate} userid={selectid} />
      <Deletebox isVisible={showconfirm} onClose={cancelLogout} cancel={cancelLogout} logout={confirmLogout} />
      <Formpopup isVisible={showform} onClose={toggleForm} />
      <Editdialog isVisible={showedit} onClose={toggleEdit} userid={shareId} />

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile ? (
            selectedFile.endsWith('.pdf') ? (
              <embed src={selectedFile} type="application/pdf" width="100%" height="500px" />
            ) : (
              <img src={selectedFile} alt="file preview" style={{ width: '100%', height: 'auto' }} />
            )
          ) : (
            <p>No file selected</p>
          )}

          {selectedFile && filterData.length > 0 && (
            <>
              {filterData.map((datas, index) => {

                const filepath = `${apiurl}${datas.file_path}`
                console.log("File Path in Data:", `${apiurl}${datas.file_path}`);
                if (filepath === selectedFile) {
                  return <div key={index} className='model-details'>
                    <h6>Email : {datas.email}</h6>
                    <h6>Date : {new Date(datas.startdate).toLocaleDateString('en-GB')}-{new Date(datas.enddate).toLocaleDateString('en-GB')}</h6>
                    <h6>Policy : {datas.policy}</h6>
                  </div>
                }
                return null;
              })}
            </>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{ display: "block", margin: 'auto' }} onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Adminpage

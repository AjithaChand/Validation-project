import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Userpage from './Userpage';
import './Users.css'
import UpdateDialog from './UpdateDialog';
import { RiDeleteBinFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoIosCloudUpload } from "react-icons/io";
import { apiurl } from './url';


const Users = () => {

  const [dialogbox, setDialogbox] = useState(false);
  const [file, setFile] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const handleDialog = () => {
    setDialogbox(!dialogbox)
  }
  const [showupdate, setShowupdate] = useState(false)
  const [selectid, setSelectid] = useState(null)
  const handleupdate = (id) => {
    setSelectid(id)
    setShowupdate(!showupdate)
  }
  const [value, setValue] = useState([])
  useEffect(() => {
    axios.get(`${apiurl}/getuser`)
      .then(res => {
        setValue(res.data)
        setRefresh(!refresh);
      })
      .catch(err => console.log(err))
  }, [refresh])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      axios.delete(`${apiurl}/delete/${id}`)
        .then(res => {
          console.log(res)
          setValue(prev => prev.filter(data => data.id !== id))
        })
        .catch(err => toast.error(err.response.data.error))
    }
  }
  const handleDownload = () => {
    window.location.href = `${apiurl}/download-excel-for-user-data`;
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${apiurl}/upload-excel-for-userdata`, formData);
      toast.success("File Uploaded Successfully!");
      setFile(null);
      setRefresh(!refresh);
    } catch (err) {
      toast.error("Upload Failed!");
      setRefresh(!refresh);
    }
  };

  return (
    <div className='users-container'>
      <div className='toggle p-3'>
      <h2 className='trustasure-title'>TrustAssure</h2>
      </div>

      <div className='row'>
        <div className='user mt-5'>
        
         <div className="admin-header-container">
          <h3 className="admin-head">User Details</h3>
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
              <span className="label-name">Choose File</span>
            </label>
            {file && <span className="file-name">{file.name}</span>}
            <button className="upload-button4" onClick={handleUpload}>
              <IoIosCloudUpload />
            </button>
          </div>
          </div>
          {/* Scrollable table container */}
          <div className="table-container">
            <table className='users-table text-center mt-5'>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {value.map((data, index) => (
                  <tr key={index}>
                    <td>{data.username}</td>
                    <td>{data.email}</td>
                    <td>{data.password}</td>
                    <td>
                      <button className='edit-btn' onClick={() => handleupdate(data.id)}>
                        <FaEdit />
                      </button>
                      <button className='ms-3 delete-btn' onClick={() => handleDelete(data.id)}>
                        <RiDeleteBinFill />
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          <div className='button-container'>
            <button className='users-btn mt-4 btn' onClick={handleDialog}>Create Account</button>
          </div>
        </div>
      </div>
      {/* Button after table */}
      <Userpage onClose={handleDialog} isVisible={dialogbox} />
      <UpdateDialog onClose={handleupdate} isVisible={showupdate} userid={selectid} />
      <ToastContainer position='top-right' autoClose={3000} />
    </div>

  )
}

export default Users

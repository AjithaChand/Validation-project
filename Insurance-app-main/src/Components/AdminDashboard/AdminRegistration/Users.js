import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Userpage from '../AdminRegistration/Dialogbox/Userpage';
import '../AdminRegistration/Users.css';
import UpdateDialog from '../AdminRegistration/Dialogbox/UpdateDialog';
import { RiDeleteBinFill, RiFileExcel2Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../url';
import AddIcon from '@mui/icons-material/Add';
import Usersdelete from '../AdminRegistration/Dialogbox/Usersdelete';
import { UserContext } from '../../../usecontext';
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoTrash } from "react-icons/io5";

const Users = () => {
  const user = localStorage.getItem("role");
  const [showconfirm, setShowconfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null);
  const [dialogbox, setDialogbox] = useState(false);
  const [file, setFile] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showupdate, setShowupdate] = useState(false);
  const [selectid, setSelectid] = useState(null);
  const [selectemail, setSelectemail] = useState(null);
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getPermission, setGetPermission] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [selectedids, setSelectedids] = useState([]);

  const { createNewUser } = useContext(UserContext);
  const { updateOldUser } = useContext(UserContext);

  const handleDialog = () => setDialogbox(!dialogbox);

  const handleupdate = (id, email) => {
    setSelectid(id);
    setSelectemail(email);
    setShowupdate(!showupdate);
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${apiurl}/getuser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setValue(res.data))
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
  }, [refresh, createNewUser, updateOldUser]);

  const handleLogout = () => setShowconfirm(true);

  const confirmLogout = () => {
    axios.delete(`${apiurl}/delete/${deleteid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(() => {
      cancelLogout();
      toast.success("User deleted successfully");
      setValue(prev => prev.filter(data => data.id !== deleteid));
    })
    .catch(err => toast.error(err.response.data.error));
  };

  const cancelLogout = () => setShowconfirm(false);

  const handleDelete = (id) => {
    setDeleteid(id);
    handleLogout();
  };

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
      setRefresh(prev => !prev);
    } catch (err) {
      toast.error("Upload Failed!");
    }
  };

  const person_code = localStorage.getItem("person_code");

  useEffect(() => {
    if (person_code) {
      axios.get(`${apiurl}/person-code-details?person_code=${person_code}`)
        .then(res => setGetPermission(res.data.info))
        .catch(err => console.log(err.message));
    }
  }, [person_code]);

  const filterValue = value.filter((data) =>
    data.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.password?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCheckboxchange = (id) => {
    setSelectedids(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleDeleterecords = async () => {
    if (selectedids.length === 0) {
      toast.error("No users selected for deletion.");
      return;
    }

    try {
      await axios.delete(`${apiurl}/delete-multiple`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        data: { userIds: selectedids }
      });

      setValue(prev => prev.filter(user => !selectedids.includes(user.id)));
      setSelectedids([]);
      toast.success("Selected users deleted successfully.");
    } catch (err) {
      console.error('Bulk deletion failed:', err);
      toast.error("Failed to delete selected users.");
    }
  };

  return (
    <div>
      <div className='users-container'>
        <div className='header-container-users'>
          <div className="admin-header-container-user">
            <p className='tablerow-user'>User Agreements</p>
            <div className="admin-header-user">
              <button className="upload-button1" onClick={handleDownload}>
                <RiFileExcel2Line className='excel-icon-user' />
              </button>
              <input
                type="file"
                id="fileInput"
                className="file-input"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="fileInput" className="file-label-user">
                Choose File
              </label>
              {file && <span className="file-name">{file.name}</span>}
              <button className="upload-button2" onClick={handleUpload}>
                <IoCloudUploadOutline className='upload-icon-user' />
              </button>
            </div>
          </div>
        </div>

        <div className='user-head-search'>
          <p className='users-total'>All Users: {filterValue.length}</p>

          <div className='user-searchbar'>
            <input
              type='text'
              value={searchValue}
              placeholder='Search user details'
              onChange={(e) => setSearchValue(e.target.value)}
              className="user-search-input"
            />
          </div>

          {(user === "admin" || (getPermission.length !== 0 && getPermission[4]?.can_create === 1)) && (
            <button className='users-btn' onClick={handleDialog}>
              <span className='createbutton'><AddIcon className="user-addicon" /> Create Account </span>
            </button>
          )}
        </div>

        <div className='user-searchbar-res mt-3'>
          <input
            type='text'
            value={searchValue}
            placeholder='Search user details'
            onChange={(e) => setSearchValue(e.target.value)}
            className='user-search-input-res'
          />
        </div>
        <button className="bulk-delete-btn" onClick={handleDeleterecords}>
  <span className='trash'><IoTrash /></span>
  <span className="delete-text">Delete Records</span>
</button>


        <div className='users-table-container'>
          {loading ? (
            <div className='users-spinner'>Loading users...</div>
          ) : (
            <div className="table-container">
              <table className='users-table text-center'>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>JoiningDate</th>
                    <th>Password</th>
                    <th>Bank Details</th>
                    <th>Pf Number</th>
                    <th>Esi Number</th>
                    <th>Salary</th>
                    <th>Branch</th>
                    <th>Station</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className='tbody-users'>
                  {filterValue.map((data, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          className='checkbox'
                          checked={selectedids.includes(data.id)}
                          onChange={() => handleCheckboxchange(data.id)}
                        />
                      </td>
                      <td>{data.id}</td>
                      <td>{data.username}</td>
                      <td>{data.email}</td>
                      <td>{new Date(data.joining_date).toISOString().split("T")[0]}</td>
                      <td>{data.password}</td>
                      <td>{data.bank_details}</td>
                      <td>{data.pf_number}</td>
                      <td>{data.esi_number}</td>
                      <td>{data.total_salary}</td>
                      <td>{data.branch_name}</td>
                      <td>{data.station_name}</td>
                      <td>{data.latitude}</td>
                      <td>{data.longitude}</td>
                      <td>
                        {(user === 'admin' || getPermission[4]?.can_update === 1) && (
                          <button className='edit-btn' onClick={() => handleupdate(data.id, data.email)}>
                            <FaEdit className='useredit-icon' />
                          </button>
                        )}
                        {(user === 'admin' || getPermission[4]?.can_delete === 1) && (
                          <button className='delete-btn' onClick={() => handleDelete(data.id)}>
                            <RiDeleteBinFill className='userdelete-icon' />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filterValue.length === 0 && !loading && (
                <h6 className='users-msg'>No User Found</h6>
              )}
            </div>
          )}
        </div>
      </div>

      <Userpage onClose={handleDialog} isVisible={dialogbox} />
      <UpdateDialog onClose={handleupdate} isVisible={showupdate} userid={selectid} useremail={selectemail} />
      <ToastContainer position='top-right' autoClose={3000} />
      <Usersdelete isVisible={showconfirm} onClose={cancelLogout} cancel={cancelLogout} logout={confirmLogout} />
    </div>
  );
};

export default Users;

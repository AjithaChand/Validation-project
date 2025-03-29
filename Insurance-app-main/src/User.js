import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';
import Formpopup from './Formpopup';
import Editdialog from './Editdialog';
import { FaEdit } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRLine } from "react-icons/ri";

const User = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const username = localStorage.getItem("username");

  const [showedit, setShowEdit] = useState(false);
  const [showform, setShowform] = useState(false);
  const [showconfirm, setShowconfirm] = useState(false);
  const [value, setValue] = useState([]);
  const [editData, setEditData] = useState(null); // Store edit data

  useEffect(() => {
    axios.get(`http://localhost:8000/read/${id}`)
      .then(res => setValue(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const toggleEdit = (data) => {
    setEditData(data);
    setShowEdit(!showedit);
  };

  const toggleForm = () => {
    setShowform(!showform);
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
    <div className='user-container'>
      <div className='profile'>
        <div className='userlogout-btn'><CgProfile /></div>
        <div className='userlogout-btn'>{username}shuruthi</div>
        <button onClick={handleLogout} className='userlogout-btn'>
          <RiLogoutCircleRLine />
        </button>
      </div>
<h3 className='text-center text-white' style={{ paddingTop: "50px" }}>User Entry</h3>
      <table className='mt-5' border={1}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Policy</th>
            <th>Files</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {value.map((data, index) => (
            <tr key={index}>
              <td>{data.email}</td>
              <td>{data.startdate}</td>
              <td>{data.enddate}</td>
              <td>{data.policy}</td>
              <td>
                {data.file ? (
                  <a href={`http://localhost:8000${data.file}`} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                ) : (
                  "No File"
                )}
              </td>
              <td>
                <button className='edit-btn' onClick={() => toggleEdit(data)}>
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='mt-5'>
        <button className='btn user-btn' onClick={toggleForm}>Add Details</button>
      </div>

      <Formpopup isVisible={showform} onClose={toggleForm} />
      <Editdialog isVisible={showedit} onClose={toggleEdit} editData={editData} />

      {showconfirm && (
          <div className='boxhover'>
          <div className="confirmbox">
            <p>Are you sure you want to logout?</p>
            <div className='box'>
            <button className="confirm-btn" onClick={confirmLogout}>Confirm</button>
            <button className="cancel-btn" onClick={cancelLogout}>Cancel</button>
            </div>
            </div>
         
        </div>
      )}
    </div>
  );
};

export default User;

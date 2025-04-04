import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';
import Formpopup from './Formpopup';
import Editdialog from './Editdialog';
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRLine } from "react-icons/ri";
// import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { IoIosCloudUpload } from "react-icons/io";
import { useContext } from "react";
import { UserContext } from "./usecontext";
import { apiurl } from "./url";
import UserDialog from './UserDialog';

const User = () => {

  const {shareId} = useContext(UserContext);
  
  // const { userId } = useContext(UserContext);

  console.log("I am from User.jsx", shareId);

  const email = localStorage.getItem('email');

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [showedit, setShowEdit] = useState(false);
  const [showform, setShowform] = useState(false);
  // logout
  const [showconfirm, setShowconfirm] = useState(false);

  const [value, setValue] = useState([]);
  const [selectid, setSelectid] = useState(null);
  useEffect(() => {
    if(email){
    axios.get(`${apiurl}/read/${email}`)
      .then(res => setValue(res.data))
      .catch(err => console.log(err));
    }
  }, [email]);

  const toggleEdit = (id) => {
    setSelectid(id);
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
    <div className='user-containerform'>
          <div className='user-profile'>
            <div className='userlogout-btn'><CgProfile /></div>
            <div className='userlogout-btn'>{username}</div>
            <button onClick={handleLogout} className='userlogout-btn'>
              <RiLogoutCircleRLine />
            </button>
          </div>
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
              <th>Action</th>
            </tr  >
          </thead>
          <tbody>
            {value.map((data, index) => (
              <tr key={index}>
                <td>{data.email}</td>
                <td>{new Date(data.startdate).toISOString().split("T")[0]}</td>
                <td>{new Date(data.enddate).toISOString().split("T")[0]}</td>
                <td>{data.policy}</td>
                <td className='tablerow'>
                  <button className='user-edit-btn' onClick={() => toggleEdit(data.id)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='mt-5 userbtn'>
          <button className='btn mt-5 user-btn' onClick={toggleForm}>Add Details</button>
        </div>
        <Formpopup isVisible={showform} onClose={toggleForm} />
        <Editdialog isVisible={showedit} onClose={toggleEdit} userid={shareId} />
        <UserDialog  isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} />
        <ToastContainer position='top-right' autoclose={3000} />
    </div>
  );
};

export default User;
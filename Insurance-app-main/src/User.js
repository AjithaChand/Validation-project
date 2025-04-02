import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';
import Formpopup from './Formpopup';
import Editdialog from './Editdialog';
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { apiurl } from './url';

const User = ( {id}) => {
  const navigate = useNavigate();
  //  const { id } = useParams();
  const username = localStorage.getItem("username");

  const [showedit, setShowEdit] = useState(false);
  const [showform, setShowform] = useState(false);
  const [showconfirm, setShowconfirm] = useState(false);
  const [value, setValue] = useState([]);
  const [selectid, setSelectid] = useState(null); // Store edit data

  useEffect(() => {
    axios.get(`${apiurl}/read/${id}`)
      .then(res => setValue(res.data))
      .catch(err => console.log(err));
  }, [id]);

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
      <div className='user-background'></div>
      <div className='user-overlay'>
        <div className='userprofilelog'>
      <div className='user-profile'>
        <div className='userlogout-btn'><CgProfile /></div>
        <div className='userlogout-btn'>{username}shuruthi</div>
        <button onClick={handleLogout} className='userlogout-btn'>
          <RiLogoutCircleRLine />
        </button>
      </div>
      <h3 className='text-center p-3 text-white'>User Entry</h3>
      </div>

      <table className='user-table' border={1}>
        <thead>
          <tr>
            <th >Email</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Policy</th>
            <th>Files</th>
            <th>Action</th>
          </tr  >
        </thead>
        <tbody>
          {value.map((data, index) => (
            <tr key={index}>
              <td>{data.email}</td>
              <td>{data.startdate}</td>
              <td>{data.enddate} </td>
              <td>{data.policy}</td>
              <td>
                {data.file ? (
                  <a href={`${apiurl}${data.file}`} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                ) : (
                  "No File"
                )}
              </td>
              <td className='tablerow'>
                <button className='user-edit-btn' onClick={() => toggleEdit(data.id)}>
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
          <tr>
            <td>shuruthimanoharan10@gmail.com</td>
            <td>29/03/2025</td>
            <td>30/04/2025</td>
            <td>Medical Insurance</td>
            <td>Viewfile</td>
            <td><button>view</button></td>
          </tr>
         
        </tbody>
      </table>

      <div className='mt-5'>
        <button className='btn mt-5 user-btn' onClick={toggleForm}>Add Details</button>
      </div>

      <Formpopup isVisible={showform} onClose={toggleForm} />
      <Editdialog isVisible={showedit} onClose={toggleEdit} userid={selectid} />

      {showconfirm && (
          <div className='user-boxhover'>
          <div className="user-confirmbox">
            <p>Are you sure you want to logout?</p>
            <div className='user-box'>
            <button className="user-confirm-btn" onClick={confirmLogout}>Confirm</button>
            <button className="user-cancel-btn" onClick={cancelLogout}>Cancel</button>
            </div>
            </div>
         
        </div>
      )}
      </div>
    </div>
  );
};

export default User;

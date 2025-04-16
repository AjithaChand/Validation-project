import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Userpage from '../AdminRegistration/Dialogbox/Userpage';
import '../AdminRegistration/Users.css'
import UpdateDialog from '../AdminRegistration/Dialogbox/UpdateDialog';
import { RiDeleteBinFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoIosCloudUpload } from "react-icons/io";
import { apiurl } from '../../../url';
import AddIcon from '@mui/icons-material/Add';
import Usersdelete from '../AdminRegistration/Dialogbox/Usersdelete';
import { UserContext } from '../../../usecontext';
import { FaSearch } from "react-icons/fa";

const Users = () => {

  const user = localStorage.getItem("role")
  const [showconfirm, setShowconfirm] = useState(false);
  const [deleteid, setDeleteid] = useState(null);
  const [dialogbox, setDialogbox] = useState(false);
  const [file, setFile] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showupdate, setShowupdate] = useState(false);
  const [selectid, setSelectid] = useState(null);
  const[selectemail,setSelectemail]=useState(null)
  const [value, setValue] = useState([]);
  const [loading , setLoading] = useState(true)
//permission state
  const [getPermission, setGetPermission] = useState({})

 const [searchValue, setSearchValue] = useState("")
   

  const {createNewUser} = useContext(UserContext);
  const {updateOldUser} = useContext(UserContext);

  const handleDialog = () => setDialogbox(!dialogbox);

  const handleupdate = (id,email) => {
    setSelectid(id);
    setSelectemail(email);
    setShowupdate(!showupdate);
  };

  useEffect(() => {

    setLoading(true)

    axios.get(`${apiurl}/getuser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setValue(res.data))
      .catch(err => console.log(err))
      .finally(()=>{
        setLoading(false)
      })
  }, [refresh,createNewUser,updateOldUser]);

  const handleLogout = () => setShowconfirm(true);

  const confirmLogout = () => {
    axios.delete(`${apiurl}/delete/${deleteid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
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

  //permission code 

  const person_code = localStorage.getItem("person_code")
  console.log("person_code", person_code);
  
  useEffect(()=>{
    if(person_code){
      axios.get(`${apiurl}/person-code-details?person_code=${person_code}`)

      .then(res=>setGetPermission(res.data.info))

      .catch(err=>console.log(err.message))
    }
  },[person_code])

  const filterValue=value.filter((data)=>{
    return data.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.password?.toLowerCase().includes(searchValue.toLowerCase())
  })

  return (
    <div>
      <div className='users-container'>
        <div className="admin-header-container-user">
          <div className='user-head-search'>
          {user ==="admin" ? (
            <button className='users-btn'
            onClick={handleDialog} >
              <span className='createbutton'>Create Account <AddIcon className="user-addicon" /> </span>
            </button>
          ):(
            <button className='users-btn'
          disabled={getPermission.length === 0 || getPermission[1]?.can_create !==1}

          onClick={handleDialog} >
            <span className='createbutton'>Create Account <AddIcon className="user-addicon" /> </span>
          </button>
          )}
          <div className='user-searchbar'>
            <input
              type='text'
              value={searchValue}
              placeholder='Search here'
              onChange={(e)=>setSearchValue(e.target.value)}
              className='user-search-input'
            />
             <FaSearch className="user-search-icon" />
          </div>
          </div>
          <div className="admin-header-user">
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
              <span className="text-white userslabel-name">Choose File</span>
            </label>
            {file && <span className="file-name">{file.name}</span>}
            <button className="upload-button2" onClick={handleUpload}>
              <IoIosCloudUpload />
            </button>
          </div>
        </div>

        <div><p className='tablerow-user'>USER DETAILS</p></div>

        <div className="table-container">
          <table className='users-table text-center'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Date</th>
                <th>Password</th>
                <th>Pf Number</th>
                <th>Esi Number</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='tbody-users ajay'>
              {loading ? (
                <tr>
                  <td colSpan={9}><div className='users-spinner'></div></td>
                </tr>
              ) : (
                filterValue.map((data, index) => (
                  <tr key={index}>
                    <td>{data.id}</td>
                    <td>{data.username}</td>
                    <td>{data.email}</td>
                    <td></td>
                    <td>{data.password}</td>
                    <td>{data.pf_number}</td>
                    <td>{data.esi_number}</td>
                    <td>{data.total_salary}</td>
                    <td>
                     {user ==="admin" ?(
                       <button className='edit-btn'
                      //  disabled={getPermission.length === 0 || getPermission[1]?.can_update !==1}
                       
                       onClick={() => handleupdate(data.id,data.email)}>
                         <FaEdit className='useredit-icon' />
                       </button>
                     ):(
                      <button className='edit-btn'
                      disabled={getPermission.length === 0 || getPermission[1]?.can_update !==1}
                      
                      onClick={() => handleupdate(data.id,data.email)}>
                        <FaEdit className='useredit-icon' />
                      </button>
                     )}
                     {user ==="admin" ?(
                       <button className='delete-btn'
                      //  disabled={getPermission.length === 0 ||getPermission[1]?.can_delete}
                       onClick={() => handleDelete(data.id)}>
                         <RiDeleteBinFill className='userdelete-icon' />
                       </button>
                     ):(
                      <button className='delete-btn'
                      disabled={getPermission.length === 0 ||getPermission[1]?.can_delete}
                      onClick={() => handleDelete(data.id)}>
                        <RiDeleteBinFill className='userdelete-icon' />
                      </button>
                     )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Userpage onClose={handleDialog} isVisible={dialogbox} />
      <UpdateDialog onClose={handleupdate} isVisible={showupdate} userid={selectid}  useremail={selectemail}/>
      <ToastContainer position='top-right' autoClose={3000} />
      <Usersdelete isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} />
    </div>
  );
};

export default Users;
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Userpage from './Userpage';
import './Users.css'
import UpdateDialog from './UpdateDialog';
import { RiDeleteBinFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from './url';
const Users = () => {

 // Dialogbox
  const [dialogbox,setDialogbox] = useState(false)

  const handleDialog = ()=>{
    setDialogbox(!dialogbox)
  }

   // updatepopup
   const [showupdate,setShowupdate] = useState(false)
   const [selectid,setSelectid] = useState(null)

   const handleupdate = (id)=>{
     setSelectid(id)
     setShowupdate(!showupdate)
   }

  const [value, setValue] = useState([])

    useEffect(() => {
      axios.get(`${apiurl}/getuser`)
        .then(res => setValue(res.data))
        .catch(err => console.log(err))
    }, [])

    const handleDelete = (id) =>{
      if(window.confirm("Are you sure you want to delete this data?")){
        axios.delete(`${apiurl}/delete/${id}`)
      .then(res=>{
        console.log(res)
        setValue(prev => prev.filter( data => data.id !== id))
      })
      .catch(err=>toast.error(err.response.data.error))
      }
    }

  return (
    <div className='users-container'>
  <div className='toggle fixed-top p-3'>
    <h2>User Entry</h2>
  </div>

  <div className='row'>
    <div className='user mt-5'>
      <h3 className='text-center mt-5 users-head'>Customer Details</h3>

      {/* Scrollable table container */}
      <div className="table-container">
        <table className='users-table mt-5'>
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
{/* <tr>
              <td>Shuruthimanoharan</td>
              <td>Shuruthimanoharan10@gmail.com</td>
              <td>Shuruthi@14</td>
              </tr>
              <tr>
              <td>Nishalingam</td>
              <td>Nishalingam10@gmail.com</td>
              <td>Nisha@15</td>
              </tr>
              <tr>
              <td>Nishalingam</td>
              <td>Nishalingam10@gmail.com</td>
              <td>Nisha@15</td>
              </tr>
              <tr>
              <td>Nishalingam</td>
              <td>Nishalingam10@gmail.com</td>
              <td>Nisha@15</td>
              </tr> */}
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
            
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Userpage from './Userpage';
import './Users.css'
import UpdateDialog from './UpdateDialog';
import { RiDeleteBinFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

const Users = () => {
 // Dialogbox
  const [dialogbox,setDialogbox] = useState(false)

  const handleDialog = ()=>{
    setDialogbox(!dialogbox)
  }

   // updatepopup
   const [showupdate,setShowupdate] = useState(false)

   const handleupdate = ()=>{
     setShowupdate(!showupdate)
   }

  const [value, setValue] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8000/getuser')
        .then(res => setValue(res.data))
        .catch(err => console.log(err))
    }, [])

    const handleDelete = (id) =>{
      axios.delete(`http://localhost:8000/delete/${id}`)
      .then(res=>{
        alert("Are you sure you want to delete this data?")
        console.log(res)
        setValue(prev => prev.filter( data => data.id !== id))
      })
      .catch(err=>alert(err.response.data.error))
    }

  return (
    <div>
      <div className='toggle'>
        <h2>Customer Details</h2>
      </div>
      <div className='row'>
        <div className='user col-12'>
          <h4 className='text-center' style={{ paddingTop: "50px" }}>Customer Details</h4>
          <table className='mt-5 users-table' border={1}>
            <thead>
              <tr>
                <th>Uesrname</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {value.map((data, index) => {
                return <tr key={index}>
                  <td>{data.username}</td>
                  <td>{data.email}</td>
                  <td>{data.pasword}</td>
                  <td><button className=' edit-btn'  onClick={handleupdate}><FaEdit /></button>
                    <button className='ms-3 delete-btn' onClick={()=>handleDelete(data.id)}><RiDeleteBinFill /></button>
                </td>
                </tr>
              })}

            </tbody>
          </table>
          <div className='mt-5'>
          <button className='users-btn btn' onClick={handleDialog}>Create Account</button>
          </div>
        </div>
      </div>
      <Userpage  onClose={handleDialog} isVisible={dialogbox} />
      <UpdateDialog onClose={handleupdate} isVisible={showupdate} />
    </div>
  )
}

export default Users

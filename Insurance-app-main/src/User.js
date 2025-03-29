import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './User.css';
import Formpopup from './Formpopup';
import Editdialog from './Editdialog';
import { FaEdit } from "react-icons/fa";
import { useParams , useNavigate } from 'react-router-dom';

const User = () => {

    const navigate = useNavigate()

    const [showedit,setShowEdit] = useState(false)
    
    const {id}=useParams();
    
    const username=localStorage.getItem("username");

    const toggleEdit = () =>{
      setShowEdit(!showedit)
    }

    const [showform,setShowform] = useState(false)

    const toggleForm = () =>{
      setShowform(!showform)
    }

    const [value, setValue] = useState([])

    useEffect(() => {
      axios.get(`http://localhost:8000/read/${id}`)
        .then(res => setValue(res.data))
        .catch(err => console.log(err))
    }, [id])

    const handleLogout = ()=>{
      localStorage.removeItem("authToken")
      navigate('/')
    }
  
    return (
      <div className='user-container'>
        <div>{username}</div>
          <button onClick={handleLogout} className='userlogout-btn'>Logout</button>
          <h3 className='text-center'  style={{paddingTop:"50px"}}>User Entry</h3>
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
              {value.map((data, index) => {
                return <tr key={index}>
                  <td>{data.email}</td>
                  <td>{data.startdate}</td>
                  <td>{data.enddate}</td>
                  <td>{data.policy}</td>
                  <td>{data.file}</td>
                  <td><button  className=' edit-btn' onClick={toggleEdit}><FaEdit /></button></td>
                </tr>
              })}
            </tbody>
          </table>
          <div className='mt-5'>
            <button className='btn user-btn' onClick={toggleForm}>Add Details</button>
          </div>
          <Formpopup isVisible={showform} onClose={toggleForm} />
          <Editdialog isVisible={showedit} onClose={toggleEdit} />
      </div>
    )
}

export default User

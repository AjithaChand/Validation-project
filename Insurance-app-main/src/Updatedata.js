import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './Updatedata.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Updatedata = ( {selectid} ) => {

  const {id} = useParams()

  console.log(selectid)

  const navigate = useNavigate()

  const [datas,setData] = useState({
    username:"",
    email:"",
    password:"",
  })

  useEffect(()=>{
    axios.get(`http://localhost:8000/getuser/${selectid}`)
    .then(res=>setData({...datas,username:res.data[0].username,email:res.data[0].email,password:res.data[0].password}))
    .catch(err=>console.log(err))
  },[id])

  const handleSubmit = (e) =>{
    e.preventDefault();
    axios.put(`http://localhost:8000/edituser/${id}`,datas)
    .then(res=>{
      toast.success(res.data.message)
      navigate('/users')
    })
    .catch(err=>toast.error(err.response.data.error))
  }

  return (
    <div >
      <form onSubmit={handleSubmit} className='update-form' >
        <h3 className='text-center mt-2'>Update Data</h3>
        <div className='form-group mt-3'>
          <label>Username</label>
          <input className='form-control' type='text' value={datas.username} onChange={e=>setData({...datas,username:e.target.value})} placeholder='Enter your username' />
        </div>
        <div className='form-group mt-3'>
          <label>Email</label>
          <input type='email' className='form-control' value={datas.email} onChange={e=>setData({...datas,email:e.target.value})} placeholder='Enter your email' />
        </div>
        <div className='form-group mt-3'>
          <label>Password</label>
          <input type='password' className='form-control' value={datas.password} onChange={e=>setData({...datas,password:e.target.value})} placeholder='Enter your password' />
        </div>
        <button className='btn mt-4' style={{backgroundColor:"#333"}}>Submit</button>
      </form>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Updatedata

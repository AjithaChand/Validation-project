import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Updatedata.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Updatedata = ( {userid} ) => {

  console.log(userid)

  const navigate = useNavigate()

  const [datas,setData] = useState({
    username:"",
    email:"",
    password:"",
  })

  useEffect(()=>{

    if(!userid) return;

    axios.get(`http://localhost:8000/getuser/${userid}`)
    .then(res=>{
      if(res.data.length>0){
        setData({
          username:res.data[0].username,
          email:res.data[0].email,
          password:res.data[0].password})
      }else{
        toast.error("User not found!")
      }
    })
    .catch(err=>console.log(err))
  },[userid])

  const handleSubmit = (e) =>{
    e.preventDefault();
    axios.put(`http://localhost:8000/edituser/${userid}`,datas)
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

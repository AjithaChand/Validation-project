import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Updatedata.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Updatedata = ( {selectid , close} ) => {

  const [refresh,setRefresh] = useState(false)

  console.log(selectid)

  const [datas,setData] = useState({
    username:"",
    email:"",
    password:""
  })

  console.log(datas)


<<<<<<< HEAD
  // const handleSubmit = (e) =>{
  //   e.preventDefault();
  //   axios.put(`http://localhost:8000/edituser/${selectid}`,datas)
  //   .then(res=>{
  //     toast.success(res.data.message)
  //     close()
  //     setRefresh(!refresh)
  //   })
  //   .catch(err=>toast.error(err.response.data.error))
  // }
=======
>>>>>>> 9c953a321ca48d1a54e90ace8e4b733354d98c61

  // console.log(datas ? datas : "No data from server");
  
  

  useEffect(()=>{

    if(!selectid) return;

    axios.get(`http://localhost:8000/getuser/${selectid}`)
    .then(res=>{
      if(res.data){
        setData(res.data)
      }else{
        toast.error("User not found!")
      }
    })
    .catch(err=>console.log(err))
  },[selectid,refresh])

<<<<<<< HEAD
  const handleSubmit = (e) =>{
=======
const handleSubmit = (e) =>{

>>>>>>> 9c953a321ca48d1a54e90ace8e4b733354d98c61
    e.preventDefault();
    axios.put(`http://localhost:8000/edituser/${selectid}`,datas)
    .then(res=>{
      toast.success(res.data.message)
      close()
      setRefresh(!refresh)
    })
    .catch(err=>toast.error(err.response.data.error))



    axios.post('http://localhost:8000/password_changed',{
      email: datas.email,
      password: datas.password
    })
    .then((res)=>{
      if(res.data.success){
        toast.success(`Send Email To ${datas.email}`)        
      }
    })
    .catch((err)=>{
      console.log(err.message);
    })

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

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../Updateform/Updatedata.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../../url';
import '../Updateform/Updatedata.css';

const Updatedata = ( {selectid , close} ) => {

  const [refresh,setRefresh] = useState(false)

  console.log(selectid)

  const [datas,setData] = useState({
    username:"",
    email:"",
    password:""
  })

  console.log(datas)



  console.log(datas ? datas : "No data from server");
  
  

  useEffect(()=>{

    if(!selectid) return;

    axios.get(`${apiurl}/getuser/${selectid}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res=>{
      if(res.data){
        setData(res.data)
      }else{
        toast.error("User not found!")
      }
    })
    .catch(err=>console.log(err))
  },[selectid,refresh])

const handleSubmit = (e) =>{

    e.preventDefault();
    axios.put(`${apiurl}/edituser/${selectid}`,datas,{
      headers:{
         Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res=>{
      toast.success(res.data.message)
      close()
      setRefresh(!refresh)
    })
    .catch(err=>toast.error(err.response.data.error))



    axios.post(`${apiurl}/password_changed`,{
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
        <h3 className='text-center updatehead mt-2'>Update Data</h3>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Username</label>
          <input className='form-control' type='text' value={datas.username} onChange={e=>setData({...datas,username:e.target.value})} placeholder='Enter your username' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Email</label>
          <input type='email' className='form-control' value={datas.email} onChange={e=>setData({...datas,email:e.target.value})} placeholder='Enter your email' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Password</label>
          <input type='password' className='form-control' value={datas.password} onChange={e=>setData({...datas,password:e.target.value})} placeholder='Enter your password' />
        </div>
        <button className='btn userupdate-btn mt-4' style={{backgroundColor:"#333"}}>Submit</button>
      </form>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Updatedata

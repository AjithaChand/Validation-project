import React, { useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { UserContext } from "./usecontext"; 
// import User from './User';
import { apiurl } from './url';
const Create = ({close}) => {

    const [values,setValues] = useState({
        email:"",
        startdate:"",
        enddate:"",
        policy:"",
        file:null
    })


    const { setUserId } = useContext(UserContext); 

    const handleFileChange = (e)=>{
        setValues({...values,file:e.target.files[0]})
    }

    const handleSubmit = (e) =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('email',values.email);
        formData.append('startdate',values.startdate);
        formData.append('enddate',values.enddate);
        formData.append('policy',values.policy);
        formData.append('file',values.file);

        axios.post(`${apiurl}/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
          console.log("Response:", res);
          if (res && res.data && res.data.message) {
            toast.success(res.data.message);
            close();
            setUserId(res.data.userId);
            console.log("I am from Create.jsx", res.data.userId);
          } else {
            toast.error("Unexpected response format");
          }
        })
        .catch(err => {
          console.log("Error:", err);
          if (err.response && err.response.data) {
            toast.error(err.response.data.error);
          } else {
            toast.error("An error occurred while processing your request.");
          }
        });
        
        
    }

       
        
  return (
    <div >
      <form onSubmit={handleSubmit}>
        <h3 className='text-center'>Create Data</h3>
        <div className='mt-3 form-gruop'>
            <label>Email</label>
            <input type='email' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,email:e.target.value})}/>
        </div>
        <div className='mt-3 form-gruop'>
            <label>StartDate</label>
            <input type='date' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,startdate:e.target.value})} />
        </div>
        <div className='mt-3 form-gruop'>
            <label>EndData</label>
            <input type='date' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,enddate:e.target.value})} />
        </div>
        <div className='mt-3 form-gruop'>
            <label>Policy</label>
            <input type='text' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,policy:e.target.value})} />
        </div>
        <div className='mt-3'>
          <input type='file' accept='*/*' onChange={handleFileChange} className='mt-3'/>
        </div>
        <button className='btn user-btn mt-3' style={{backgroundColor:"#333",width:"30%"}}>Submit</button>
      </form>
      <ToastContainer position='top-right' autoClose={3000}/>
     
    </div>
  )
}

export default Create

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Editdata = () => {
    const {id} = useParams()

    const navigate = useNavigate()
  
    const [values,setValues] = useState({
        email:"",
        startdate:"",
        enddate:"",
        policy:"",
        file:null
    })
  
    useEffect(()=>{
      axios.get(`http://localhost:8000/read/${id}`)
      .then(res=>setValues({...values,email:res.data[0].email,startdate:res.data[0].startdate,enddate:res.data[0].enddate,policy:res.data[0].policy,file:res.data[0].file_path}))
      .catch(err=>console.log(err))
    },[id])

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
        formData.append('file_path',values.file);

        axios.put(`http://localhost:8000/edit/${id}`,formData,{
          headers:{'Content-Type' : 'multipart/form-data'}
        })
        .then(res=>{
            toast.success(res.data.message)
            navigate('/adminpage')
        })
        .catch(err=>toast.error(err.response.data.error))
    }
  
    return (
        <div >
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Update Data</h3>
          <div className='mt-3 form-group'>
              <label>Email</label>
              <input type='email' className='form-control' value={values.email} style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,email:e.target.value})}/>
          </div>
          <div className='mt-3 form-group'>
              <label>StartDate</label>
              <input type='date' className='form-control' value={values.startdate} style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,startdate:e.target.value})} />
          </div>
          <div className='mt-3 form-group'>
              <label>EndData</label>
              <input type='date' className='form-control' value={values.enddate} style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,enddate:e.target.value})} />
          </div>
          <div className='mt-3 form-group'>
              <label>Policy</label>
              <input type='text' className='form-control' value={values.policy} style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,policy:e.target.value})} />
          </div>
          <div className='mt-3'>
            <input type='file' value={values.file} onChange={handleFileChange} className='mt-3'/>
          </div>
          <button className='btn user-btn mt-3' style={{backgroundColor:"#333",width:"30%"}}>Submit</button>
        </form>

      <ToastContainer position='top-right' autoClose={3000} />
      </div>
    )
}

export default Editdata

import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Create = () => {

    const navigate = useNavigate()

    const [values,setValues] = useState({
        email:"",
        startdate:"",
        enddate:"",
        policy:""
    })

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:8000/create',values)
        .then(res=>{
            console.log(res.data)
            navigate('userdata')
        })
        .catch(err=>console.log(err))
    }

  return (
    <div className='d-flex justify-content-center' style={{ display:"flex",alignItems:"center",justifyContent: "center",height: "100vh",backgroundColor:"gray"}}>
      <form onSubmit={handleSubmit} className='form-data' style={{width:"30%"}}>
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
        <input type='file' className='mt-3'/>
        <button className='btn mt-3'>Submit</button>
      </form>
    </div>
  )
}

export default Create

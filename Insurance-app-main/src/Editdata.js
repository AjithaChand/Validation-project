import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Editdata = () => {
    const {id} = useParams()
  
    const [values,setValues] = useState({
        email:"",
        startdate:"",
        enddate:"",
        policy:"",
        file:""
    })
  
    useEffect(()=>{
      axios.get(`http://localhost:8000/read/${id}`)
      .then(res=>setValues({...values,email:res.data[0].email,startdate:res.data[0].startdate,enddate:res.data[0].enddate,policy:res.data[0].policy,file:res.data[0].file_path}))
      .catch(err=>console.log(err))
    },[])

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
            alert(res.data.message)
        })
        .catch(err=>alert(err.response.data.error))
    }
  
    return (
        <div >
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Update Data</h3>
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
            <input type='file'accept='image/*' onChange={handleFileChange} className='mt-3'/>
          </div>
          <button className='btn user-btn mt-3' style={{backgroundColor:"#333",width:"30%"}}>Submit</button>
        </form>
      </div>
    )
}

export default Editdata

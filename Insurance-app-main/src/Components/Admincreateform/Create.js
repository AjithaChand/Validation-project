import React, { useContext, useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../Admincreateform/Create.css'
// import User from './User';
import { apiurl } from '../../url';
import { UserContext } from '../../usecontext';


const Create = ({ close }) => {

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0]; // Format: yyyy-mm-dd

  const [values, setValues] = useState({
    email: "",
    startdate: formattedToday,
    enddate: "",
    policy: "",
    file: null,
    profile: null
  })


  const { setRefreshCreateFromAdmin } = useContext(UserContext)


  const handleFileChange = (e) => {
    setValues({ ...values, file: e.target.files[0] })
  }

  const handleProfileChange = (e) =>{
    setValues ({...values, profile: e.target.files[0]})
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('startdate', values.startdate);
    formData.append('enddate', values.enddate);
    formData.append('policy', values.policy);
    formData.append('file', values.file);
    formData.append('profile', values.profile)

    axios.post(`${apiurl}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        console.log("Response:", res);
        if (res && res.data) {
          toast.success(res.data.message);
          localStorage.setItem('email', res.data.email)
          setRefreshCreateFromAdmin(pre => !pre)
          close();
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
      <form className='create-form' onSubmit={handleSubmit}>
        <h5 className='text-center create-head'>Admin Create Data</h5>
        <div className='mt-3 form-gruop'>
          <label className='create-label'>Email</label>
          <input type='email' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, email: e.target.value })} />
        </div>
        <div className='mt-3 form-gruop'>
          <label className='create-label'>StartDate</label>
          <input
            type='date'
            className='form-control'
            value={values.startdate}
            readOnly
            style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          />
        </div>

        <div className='mt-3 form-gruop'>
          <label className='create-label'>EndData</label>
          <input type='date' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, enddate: e.target.value })} />
        </div>
        <div className='mt-3 form-gruop'>
          <label className='create-label'>Policy</label>
          <input type='text' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, policy: e.target.value })} />
        </div>
        <div className="mt-3 form-gruop">
          <label className="update-label">Profile Photo</label>
          <input
            type="file"
            name="profile" 
            accept=".jpg,.png,.jpeg*"
            onChange={handleProfileChange}
            className="mt-3 form-control"
          />
        </div>
        <div className='mt-3'>
          <input type='file'
          name='file'
           accept='*/*' 
           onChange={handleFileChange}
            className='mt-3' />
        </div>
        <button className='btn create-button mt-3' style={{ backgroundColor: "#333" }}>Submit</button>
      </form>
      <ToastContainer position='top-right' autoClose={3000} />


    </div>
  )
}

export default Create

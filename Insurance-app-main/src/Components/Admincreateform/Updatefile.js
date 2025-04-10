import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../url';
// import { UserContext } from "./usecontext"; 
import { UserContext } from "../../usecontext"; 
import "./updatefile.css";

const Updatefile = ({ close,selectid}) => {

    // const { userId } = useContext(UserContext);
    // const email = localStorage.getItem('email');

    const {setRefreshFromUpdate} = useContext(UserContext)

    const [values, setValues] = useState({
        email: "",
        startdate: "",
        enddate: "",
        policy: "",
        // file: null
    });
    console.log(selectid,"fghjkl")

      const handleFileChange = (e) => {
    setValues({ ...values, file: e.target.files[0] });
  };

    useEffect(() => {
        if (!selectid) return;
    
        console.log("Fetching data for Email:", selectid);
        axios.get(`${apiurl}/read-data-by-id/${selectid}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                console.log("API Response:", res);
                if (res.data && res.data.result) {
                    const userData = res.data.result[0];
    
                    const formatDate = (dateString) => {
                        if (!dateString) return "";
                        const date = new Date(dateString);
                        date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); 
                        return date.toISOString().split('T')[0];
                    };


                    setValues({
                        ...userData,
                        startdate: formatDate(userData.startdate),
                        enddate: formatDate(userData.enddate),
                    });
                    console.log("Set values:", userData);
                    // reFresh()

                } else {
                    toast.error("User not found");
                }
            })
            .catch(err => {
                console.log("API Error:", err);
                toast.error("Failed to fetch data");
            });
    }, [selectid]);
    
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!values.email || !values.startdate || !values.enddate || !values.policy) {
            toast.error("Please fill in all fields.");
            return;
        }
        
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('startdate', values.startdate);
            formData.append('enddate', values.enddate);
            formData.append('policy', values.policy);
            formData.append('file', values.file);
        
            
            axios.put(`${apiurl}/update-data-in-admin/${selectid}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${localStorage.getItem("token")}`},
            })
            .then((res) => {
              console.log('Response:', res);
              if (typeof close === 'function') {
                toast.success(res.data.message);
                setRefreshFromUpdate(pre=>!pre)
                close();
              }
            })
            .catch((err) => {
              console.log('Error:', err);
              if (err.response && err.response.data) {
                toast.error(err.response.data.error);
              }
            });
        };
         
    return (
        <div>
            <div className='updatebox'>
            <form onSubmit={handleSubmit}>
                <h3 className='heading mt-2 text-center'> Admin Update Data</h3>
                <div className='mt-3 form-group'>
                    <label className='update-label'>Email</label>
                    <input 
                        type='email' 
                        className='form-control' 
                        value={values.email} 
                        onChange={e => setValues({...values, email: e.target.value })} 
                    />
                </div>
                <div className='mt-3 form-group'>
                    <label className='update-label'>StartDate</label>
                    <input 
                        type='date' 
                        className='form-control' 
                        value={values.startdate} 
                        onChange={e => setValues({...values, startdate: e.target.value })} 
                    />
                </div>
                <div className='mt-3 form-group'>
                    <label className='update-label'>EndDate</label>
                    <input 
                        type='date' 
                        className='form-control' 
                        value={values.enddate} 
                        onChange={e => setValues({...values, enddate: e.target.value })} 
                    />
                </div>
                <div className='mt-3 form-group'>
                    <label className='update-label'>Policy</label>
                    <input 
                        type='text' 
                        className='form-control' 
                        value={values.policy} 
                        onChange={e => setValues({...values, policy: e.target.value })} 
                    />
                </div>
        <div className="mt-3">
          <input
            type="file"
            accept="/"
            onChange={handleFileChange}
            className="mt-3"
          />
        </div>
          <button className='btn user-btn mt-3' style={{backgroundColor:"#333"}} >Submit</button>
            </form>
            <ToastContainer position='top-right' autoClose={3000} />
            </div>
        </div>
    );
}

export default Updatefile;
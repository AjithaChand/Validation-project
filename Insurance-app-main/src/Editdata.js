import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from './url';
import { UserContext } from "./usecontext"; 

const Editdata = ({close}) => {

    const { userId } = useContext(UserContext);

    console.log("I'm From EditData ", userId)

    const [values, setValues] = useState({
        email: "",
        startdate: "",
        enddate: "",
        policy: "",
        // file: null
    });

    useEffect(() => {
        if(!userId) return;

        axios.get(`${apiurl}/data-for-user-edit/${userId}`)
            .then(res =>{
                if(res.data){
                    setValues(res.data.result)
                    console.log(res.data.result);
                    
                }else{
                    toast.error("User not found")
                }
            })
            .catch(err => console.log(err));
    }, [userId]);

    // const handleFileChange = (e) => {
    //     setValues(prev => ({ ...prev, file: e.target.files[0] }));
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('startdate', values.startdate);
        formData.append('enddate', values.enddate);
        formData.append('policy', values.policy);
        // formData.append('file_path', values.file);

        axios.put(`${apiurl}/edit/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            toast.success(res.data.message);
            close()
        })
        .catch(err => toast.error(err.response?.data?.error || "An error occurred"));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3 className='text-center'> User Update Data</h3>
                <div className='mt-3 form-group'>
                    <label>Email</label>
                    <input type='email' className='form-control' value={values.email} onChange={e => setValues(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className='mt-3 form-group'>
                    <label>StartDate</label>
                    <input type='date' className='form-control' value={values.startdate} onChange={e => setValues(prev => ({ ...prev, startdate: e.target.value }))} />
                </div>
                <div className='mt-3 form-group'>
                    <label>EndDate</label>
                    <input type='date' className='form-control' value={values.enddate} onChange={e => setValues(prev => ({ ...prev, enddate: e.target.value }))} />
                </div>
                <div className='mt-3 form-group'>
                    <label>Policy</label>
                    <input type='text' className='form-control' value={values.policy} onChange={e => setValues(prev => ({ ...prev, policy: e.target.value }))} />
                </div>
                {/* <div className='mt-3'>
                    <input type='file' onChange={handleFileChange} className='mt-3' />
                </div> */}
                <button className='btn user-btn mt-3' style={{ backgroundColor: "#333", width: "30%" }}>Submit</button>
            </form>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>
    );
}

export default Editdata;

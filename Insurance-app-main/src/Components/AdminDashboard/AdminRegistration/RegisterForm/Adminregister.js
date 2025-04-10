import React, { useState } from 'react'
import axios from 'axios';
import '../RegisterForm/Adminregister.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../../url';

const Adminregister = ({close}) => {

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        role:""
    })

    const [checkbox,setCheckbox] = useState({
    
    })

    const handleSubmit = (e) => { 
        e.preventDefault();

        if(values.role==="select"){
            toast.error("Choose the account type")
        }

        // email regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(values.email)){
           return toast.error("Invalid Email")
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;

        if (!passwordRegex.test(values.password)) {
            return toast.warning("Password must be 8 characters includes one number one special character")
        }
        axios.post(`${apiurl}/admin/register`, values,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                toast.success(res.data.message)
                // navigate("/dashboard/users")
                close()
            })
            .catch(err => toast.error(err.response.data.error))
    }

    return (
        <div  className='adminregister-container' style={{height:"100vh",width:"100vw"}}>
            <div className='adminregister-form'>
                <form onSubmit={handleSubmit} className='adminform-data' style={{ width: "35%" }}>
                    <h3 className='text-center register-head mb-5'>Register Form</h3>
                    <div className='mt-4 form-group'>
                        <label className='register-label'>Username</label>
                        <input type='text' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, username: e.target.value })} placeholder='Enter your name' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='register-label'>Email</label>
                        <input type='email' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, email: e.target.value })} placeholder='Enter your email' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='register-label'>Password</label>
                        <input type='password' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, password: e.target.value })} placeholder='Enter your password' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='register-label'>Select Account</label>
                        <select className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, role: e.target.value })} >
                            <option  value={"select"} default></option>
                            <option value={"admin"}>Admin</option>
                            <option value={"user"}>User</option>
                        </select>
                    </div>
                    <div className='user-checkbox'>
                        <div><label>Create</label><input value={0} type='checkbox'/></div>
                        <div><label>Read</label><input value={0} type='checkbox'/></div>
                        <div><label>Update</label><input value={0} type='checkbox'/></div>
                        <div><label>Delete</label><input value={0} type='checkbox'/></div>
                    </div>
                    <button className='btn mt-3 adminregister-btn'>Register</button>
                </form>
                
            </div>
            <ToastContainer position='top-right' autoClose={3000}/> 
        </div>

    )
}

export default Adminregister

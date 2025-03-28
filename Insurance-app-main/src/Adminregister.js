import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Adminregister.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Adminregister = () => {
    
    const navigate = useNavigate()

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        role:""
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
        axios.post("http://localhost:8000/admin/register", values)
            .then(res => {
                toast.success(res.data.message)
                navigate("/users")
            })
            .catch(err => toast.error(err.response.data.error))
    }

    return (
        <div  className='adminregister-container' style={{height:"100vh",width:"100vw"}}>
            <div className='adminregister-form'>
                <form onSubmit={handleSubmit} className='adminform-data' style={{ width: "35%" }}>
                    <h3 className='text-center mb-5'>Register Form</h3>
                    <div className='mt-4 form-group'>
                        <label>Username</label>
                        <input type='text' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, username: e.target.value })} placeholder='Enter your name' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label>Email</label>
                        <input type='email' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, email: e.target.value })} placeholder='Enter your email' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label>Password</label>
                        <input type='password' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, password: e.target.value })} placeholder='Enter your password' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label>Select Account</label>
                        <select className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, role: e.target.value })} >
                            <option  value={"select"} default></option>
                            <option value={"admin"}>Admin</option>
                            <option value={"user"}>User</option>
                        </select>
                    </div>
                    <button className='btn mt-3 adminregister-btn'>Register</button>
                </form>
                
            </div>
            <ToastContainer position='top-right' autoClose={3000}/> 
        </div>

    )
}

export default Adminregister

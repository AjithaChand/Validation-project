import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Register.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiurl } from './url';
const Register = () => {
    const[active,setActive]=useState("signup");
    const navigate = useNavigate()
console.log(apiurl,"aaa")
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        // email regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(values.email)){
           return toast.error("Invalid Email")
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;
       if (!passwordRegex.test(values.password)) {
            return toast.error("Password must be 8 characters includes one number one special character")
        }
        axios.post(`${apiurl}/register`, values)
            .then(res => {
                toast.success(res.data.message)
                navigate("/")
            })
            .catch(err => toast.error(err.response.data.error))

        }

    return (
        <div  className='register-container' style={{height:"100vh",width:"100vw"}}>
            <div className='register-form'>
                <form onSubmit={handleSubmit} className='form-data' style={{ width: "35%" }}>
                    <h3 className='text-center text-white mb-5'>Register Form</h3>
                    <div className='button-container'>
                        <button className={`btn button-group ${active==="login"?"active":""}`} onClick={()=>{setActive("login");navigate("/")}}>Login</button>
                        <button className={`btn button-group ${active==="signup"?"active":""}`} onClick={()=>setActive("signup")}>Signup</button>
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='text-white'>Username</label>
                        <input type='text' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, username: e.target.value })} placeholder='Enter your name' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='text-white'>Email</label>
                        <input type='email' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, email: e.target.value })} placeholder='Enter your email' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='text-white'>Password</label>
                        <input type='password' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e => setValues({ ...values, password: e.target.value })} placeholder='Enter your password' required />
                    </div>
                    <button className='btn mt-4'>Register</button>
                </form>
            </div>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>

    )
}

export default Register

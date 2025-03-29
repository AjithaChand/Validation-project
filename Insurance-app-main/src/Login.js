import React, { useState } from 'react'
import "./Login.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {

    const navigate = useNavigate();

    const [active, setActive] = useState("login")

    const [values,setValues] = useState({
        email:"",
        password:""
    })

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:8000/login",values)
        .then(res=>{
            toast.success(res.data.message)
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("role",res.data.role)
            if(res.data.role==="admin"){
                navigate("/admin")
            }
            else{
                navigate("/home")
            }
        })
        .catch(err=>toast.error(err.response.data.error))
    }

    return (
        <div className='login-container' style={{height:"100vh",width:"100vw"}}>
            <div className='login-form '>
                <form onSubmit={handleSubmit} className='form-data' style={{width:"35%"}}>
                <h3 className='text-center mb-5 text-white '>Login Form</h3>
                    <div className='button-container'>
                        <button className={`btn button-group ${active === "login" ? "active" : ""}`} onClick={()=>setActive("login")}>Login</button>
                        <button className={`btn button-group ${active === "signup" ? "active" : ""}`} onClick={()=>{setActive("signup");navigate('/register')}}>Signup</button>
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='text-white'>Email</label>
                        <input type='email' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,email:e.target.value})} placeholder='Enter your email' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='text-white'>Password</label>
                        <input type='password' className='form-control' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,password:e.target.value})} placeholder='Enter your password' required/>
                    </div>
                    <button className='btn mt-5'>Login</button>
                </form>
            </div>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>
    )
}

export default Login

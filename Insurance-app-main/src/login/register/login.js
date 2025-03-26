import React, { useState } from 'react'
import "./login.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {

    const navigate = useNavigate();

    const [active, setActive] = useState("login")

    const [values,setValues] = useState({
        email:"",
        password:""
    })

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:8000",values)
        .then(res=>{
            alert(res.data.message)
            localStorage.setItem("token",res.data.token)
            navigate("/userdata")
        })
        .catch(err=>alert(err.response.data.error))
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
        </div>
    )
}

export default Login

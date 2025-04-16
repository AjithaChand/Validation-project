import React, { useContext, useEffect, useState } from 'react'
import '../Login/Login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../url';
import { UserContext } from '../../usecontext';

const Login = () => {

    const navigate = useNavigate();

    const [active, setActive] = useState("login")

//   const { setAllPermission } = useContext(UserContext)
    // const [results,setResult]=useState([]);

    const { setResult } = useContext(UserContext);

    const [values,setValues] = useState({
        email:"",
        password:""
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${apiurl}/login`, values)
            .then(res => {
                console.log("Login successful message",res.data.message)
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role);
                localStorage.setItem("username", res.data.username);
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("person_code",res.data.person_code)
                // setAllPermission(res.data.permission)
                console.log(res.data.permission);
                
                

                // fetchPersonDetails(res.data.person_code);

                if (res.data.role === "admin") {
                    toast.success(res.data.message);
                    
                     navigate("/dashboard");

                    
                } else {

                    if(!res.data.permission || res.data.permission.length===0){
                        toast.error("You don't have permission to access this page")
                        return;
                    }
                    toast.success(res.data.message);
                    navigate("/dashboard");
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.error || "Login failed");
                console.log("Login Error:", err.message);
            });            
    }

// const fetchPersonDetails = async (person_code) =>{
//         try{
//             const result = await axios.get(`${apiurl}/person-code-details?person_code=${person_code}`)
//             setResult(result.data.info)
//             console.log("Fetched person details:", result.data.info);
//         }
//         catch(err){
//             console.log("Error fetching person details:", err.message);
//         }
// }


// console.log("All results from login",results);

    return (
        <div className='login-container' style={{height:"100vh",width:"100vw"}}>
            <div className='login-form '>
                <form onSubmit={handleSubmit} className='form-data'>
                <h3 className='text-center mb-5 text-white '>Login Form</h3>
                    <div className='button-container'>
                        <button className={`btn button-group ${active === "login" ? "active" : ""}`} onClick={()=>setActive("login")}>Login</button>
                        <button className={`btn button-group ${active === "signup" ? "active" : ""}`} onClick={()=>{setActive("signup");navigate('/register')}}>Signup</button>
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='label text-white'>Email</label>
                        <input type='email' className='form-control-login' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,email:e.target.value})} placeholder='Enter your email' required />
                    </div>
                    <div className='mt-4 form-group'>
                        <label className='label text-white'>Password</label>
                        <input type='password' className='form-control-login' style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} onChange={e=>setValues({...values,password:e.target.value})} placeholder='Enter your password' required/>
                    </div>
                    <button className='btn mt-5'>Login</button>
                </form>
            </div>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>
    )
}

export default Login

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import '../Register/Register.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../url';
import { TextField } from '@mui/material';
import PasswordInput from '../Login/PasswordInput';
const Register = () => {
    const [active, setActive] = useState("signup");
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        // email regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(values.email)) {
            return toast.error("Invalid Email")
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{3,}$/;
        if (!passwordRegex.test(values.password)) {
            return toast.error("Password must be 8 characters includes one number one special character")
        }

        try {
            const res = await axios.post(`${apiurl}/register`, values)
            toast.success(res.data.message)
            navigate("/")


            await axios.post(`${apiurl}/email_for_register`, {
                email: values.email,
                username: values.username
            })

        } catch (err) {
            toast.error(err.response.data.error)
        }
    }

    return (
        <div className='register-container' style={{ height: "100vh", width: "100vw" }}>
            <div className='register-form'>
                <form onSubmit={handleSubmit} className='form-data'>
                    <h3 className='text-center text-white mb-5'>Register Form</h3>
                    <div className='button-container'>
                        <button className={`btn button-group ${active === "login" ? "active" : ""}`} onClick={() => { setActive("login"); navigate("/") }}>Login</button>
                        <button className={`btn button-group ${active === "signup" ? "active" : ""}`} onClick={() => setActive("signup")}>Signup</button>
                    </div>
                    <div className='mt-4 form-group'>
                        <TextField
                            fullWidth
                            margin='normal'
                            type='text'
                            className='form-control-register'
                            onChange={e => setValues({ ...values, username: e.target.value })}
                            label='Enter your name'
                            required
                            InputLabelProps={{
                                required: false
                            }}
                        />
                    </div>
                    <div className='mt-4 form-group'>
                        <TextField
                            fullWidth
                            margin='normal'
                            type='email'
                            className='form-control-register'
                            onChange={e => setValues({ ...values, email: e.target.value })}
                            label='Enter your email'
                            required
                            InputLabelProps={{
                                required: false
                            }}
                        />
                    </div>
                    <div className='mt-4 form-group'>
                        <PasswordInput
                            value={values.password}
                            onChange={e => setValues({ ...values, password: e.target.value })}
                        />
                    </div>
                    <button className='btn register-btn mt-4'>Register</button>
                </form>
            </div>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>

    )
}

export default Register

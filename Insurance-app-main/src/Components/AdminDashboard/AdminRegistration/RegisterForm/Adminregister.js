import React, { useContext, useState } from 'react'
import axios from 'axios';
import '../RegisterForm/Adminregister.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../../url';
import { UserContext } from '../../../../usecontext';

const Adminregister = ({ close }) => {

    const { setCreateNewUser } = useContext(UserContext);

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        total_salary: 0,
        role: "",
        pf_amount: 0,
        esi_amount: 0,
        net_amount: 0,
        gross_salary: 0,
        pf_number: "",
        esi_number: ""
    });

    const [permission, setPermission] = useState({
        'dashboard': { read: false, create: false, update: false, delete: false },

        'payslip': { read: false, create: false, update: false, delete: false },
    })

    const handleSalarychange = (e) => {
        const salary = parseFloat(e.target.value);
        if (isNaN(salary)) return;
        const total_salary = salary;
        const pf = (salary * 0.12).toFixed(2);
        const esi = (salary * 0.0075).toFixed(2);
        const net = (salary - pf - esi).toFixed(2);
        const gross_salary = salary;
        const pf_number = generatePfNumber();
        const esi_number = generateesiNumber();

        setValues(prev => ({
            ...prev,
            total_salary: salary,
            pf_amount: pf,
            esi_amount: esi,
            net_amount: net,
            gross_salary,
            pf_number,
            esi_number
        }));
    }

    const generatePfNumber = () => {
        const prefix = "NASTAF639000";
        const lastNumber = localStorage.getItem("lastPfNumber");
        const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
        const formattedNumber = String(nextNumber).padStart(3, "0");
        const pf = `${prefix}${formattedNumber}`;
        localStorage.setItem("lastPfNumber", nextNumber);
        return pf;
    };

    const generateesiNumber = () => {
        const prefix = "121000388110001302";
        const lastNumber = localStorage.getItem("lastEsiNumber");
        const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
        const formattedNumber = String(nextNumber).padStart(3, "0");
        const pf = `${prefix}${formattedNumber}`;
        localStorage.setItem("lastEsiNumber", nextNumber);
        return pf;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Values", values);
        console.log("permissions", permission);


        if (values.role === "select" || values.role === "") {
            return toast.error("Choose the account type");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(values.email)) {
            return toast.error("Invalid Email");
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;
        if (!passwordRegex.test(values.password)) {
            return toast.warning("Password must be 8 characters, include one number and one special character");
        }

        axios.post(`${apiurl}/admin/register`,
            { ...values, permissions: permission }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                toast.success(res.data.message);
                setCreateNewUser(pre => !pre)
                close();
            })
            .catch(err => toast.error(err.response?.data?.error || "Something went wrong"));
    }

    return (
        <div className='adminregister-container'>
            <div className='adminregister-form'>
                <form onSubmit={handleSubmit} className='adminform-data'>
                    <h3 className='text-center register-head mb-2'>Register Form</h3>
                    <div className='mt-3 form-group'>
                        <label className='register-label'>Username</label>
                        <input type='text' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, username: e.target.value })} placeholder='Enter your name' required />
                    </div>
                    <div className='mt-3 form-group'>
                        <label className='register-label'>Email</label>
                        <input type='email' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, email: e.target.value })} placeholder='Enter your email' required />
                    </div>
                    <div className='mt-3 form-group'>
                        <label className='register-label'>Password</label>
                        <input type='password' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, password: e.target.value })} placeholder='Enter your password' required />
                    </div>
                    <div className='mt-3 form-group'>
                        <label className='register-label'>Salary</label>
                        <input type='number' className='form-control' onChange={handleSalarychange} style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} placeholder='Enter salary' required />
                    </div>
                    <div className='mt-3 form-group'>
                        <label className='register-label'>Select Role</label>
                        <div className='permissions-role mt-2'>
                            <label>
                                <input
                                    type='radio'
                                    name='role'
                                    value='admin'
                                    onChange={e => setValues({ ...values, role: e.target.value })}
                                    checked={values.role === 'admin'}
                                    required
                                />
                                Admin
                            </label>
                            <label>
                                <input
                                    type='radio'
                                    name='role'
                                    value='user'
                                    onChange={e => setValues({ ...values, role: e.target.value })}
                                    checked={values.role === 'user'}
                                    required
                                />
                                User
                            </label>
                        </div>
                    </div>
                    
                    <div className='mt-3 form-group'>
                    <label className='register-label'>Dashboard Permissions</label>
                    <div className='permissions mt-2'>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.dashboard.read}
                                onChange={e => setPermission(prev => ({
                                    ...prev,
                                    dashboard: { ...prev.dashboard, read: e.target.checked }
                                }))}
                            /> Read
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.dashboard.create}
                                onChange={e => setPermission(prev => ({
                                    ...prev,
                                    dashboard: { ...prev.dashboard, create: e.target.checked }
                                }))}
                            /> Create
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.dashboard.update}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    dashboard: { ...permission.dashboard, update: e.target.checked }
                                }))}
                            /> Update
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.dashboard.delete}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    dashboard: { ...permission.dashboard, delete: e.target.checked }
                                }))}
                            /> Delete
                        </label>
                    </div>
                    </div>

                    <div className='mt-3 form-group'>
                    <label className='register-label'>Payslip Permissions</label>
                    <div className='permissions mt-2'>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.payslip.read}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    payslip: { ...permission.payslip, read: e.target.checked }
                                }))}
                            /> Read
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.payslip.create}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    payslip: { ...permission.payslip, create: e.target.checked }
                                }))}
                            /> Create
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.payslip.update}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    payslip: { ...permission.payslip, update: e.target.checked }
                                }))}
                            /> Update
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.payslip.delete}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    payslip: { ...permission.payslip, delete: e.target.checked }
                                }))}
                            /> Delete
                        </label>
                    </div>
                    </div>
                   
                    <button className='btn mt-3 adminregister-btn'>Register</button>
                </form>
            </div>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>
    )
}

export default Adminregister;
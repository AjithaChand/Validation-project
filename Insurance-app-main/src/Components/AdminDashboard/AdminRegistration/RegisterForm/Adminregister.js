import React, { useContext,useEffect, useState } from 'react'
import axios from 'axios';
import '../RegisterForm/Adminregister.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../../url';
import { UserContext } from '../../../../usecontext';

const Adminregister = ({ close }) => {

    const { setCreateNewUser } = useContext(UserContext);

    const [leavedays, setLeavedays] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [revisedsalary, setRevisedsalary] = useState(0);

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
        esi_number: "",
        date: "",
        joining_date: "",
        revised_salary: 0
    });

    const [permission, setPermission] = useState({
        dashboard: { read: false, create: false, update: false, delete: false },
        payslip: { read: false, create: false, update: false, delete: false },
        users: { read: false, create: false, update: false, delete: false },
        attendance: { read: false, create: false, update: false, delete: false },
    });

    const calculateRevisedSalary = (leaveDays, net) => {
        const workingDays = 30;
        const perDaySalary = net / workingDays;
        const leaveSalary = leaveDays * perDaySalary;
        const revised = net - leaveSalary;
        console.log("Revised salary calculated:", revised);
        return revised;
    };

    useEffect(() => {
        if (!values.username) return;
    
        axios.get(`${apiurl}/get_attendance_datas`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                const data = res.data;
                const employee = data.find(emp => emp.emp_name === values.username);
    
                if (employee) {
                    const leave = employee.leave_days;
                    const amount = parseFloat(values.net_amount); // use latest state
    
                    const revised = calculateRevisedSalary(leave, amount);
                    setLeavedays(leave);
                    setRevisedsalary(revised);
    
                    setValues(prev => ({
                        ...prev,
                        revised_salary: revised
                    }));
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Error fetching attendance data");
            });
    }, [values.username, values.net_amount]); // ✅ Add this if needed
    

    const handleSalarychange = (e) => {
        const salary = parseFloat(e.target.value);
        if (isNaN(salary)) return;
    
        const pf = (salary * 0.12).toFixed(2);
        const esi = (salary * 0.0075).toFixed(2);
        const net = (salary - pf - esi).toFixed(2);
    
        const revised = calculateRevisedSalary(leavedays, parseFloat(net));
    
        setValues(prev => ({
            ...prev,
            total_salary: salary,
            pf_amount: pf,
            esi_amount: esi,
            net_amount: net,
            gross_salary: salary,
            revised_salary: revised  
        }));
    
        setRevisedsalary(revised);
        setNetAmount(net);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
    
        try {
            const res = await axios.get(`${apiurl}/get_attendance_datas`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
    
            const data = res.data;
            const employee = data.find(emp => emp.emp_name === values.username);
    
            let finalRevisedSalary = parseFloat(values.net_amount); // default to net
            let leaveDays = 0;
    
            if (employee) {
                leaveDays = employee.leave_days;
                finalRevisedSalary = calculateRevisedSalary(leaveDays, parseFloat(values.net_amount));
            }
    
            const finalData = {
                ...values,
                revised_salary: finalRevisedSalary,
                permissions: permission
            };
    
            await axios.post(`${apiurl}/admin/register`, finalData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
    
            toast.success("User registered successfully");
            setCreateNewUser(pre => !pre);
            close();
    
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Something went wrong");
        }
    };
    

    return (
        <div className='adminregister-container'>
            <div className='adminregister-form'>
               <div className='container'>
               <form onSubmit={handleSubmit} className='adminform-data'>
                    <h3 className='text-center register-head mb-2'>Register Form</h3>
                    <div className='row'>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Username</label>
                        <input type='text' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, username: e.target.value })} placeholder='Enter your name' required />
                    </div>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Email</label>
                        <input type='email' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, email: e.target.value })} placeholder='Enter your email' required />
                    </div>
                    </div>
                    <div className='row'>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Password</label>
                        <input type='password' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, password: e.target.value })} placeholder='Enter your password' required />
                    </div>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Salary</label>
                        <input type='number' className='form-control' onChange={handleSalarychange} style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} placeholder='Enter salary' required />
                    </div>
                    </div>
                    <div className='row'>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Pf Number</label>
                        <input type='number' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, pf_number: e.target.value })} placeholder='Enter Pf number' required />
                    </div>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Esi Number</label>
                        <input type='number' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, esi_number: e.target.value })} placeholder='Enter Esi number' required />
                    </div>
                    </div>
                    <div className='row'>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Date</label>
                        <input type='date' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values,date: e.target.value })} placeholder='select date' required />
                    </div>
                    <div className='mt-3 col-6 form-group'>
                        <label className='register-label'>Joiningdate</label>
                        <input type='date' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values,joining_date: e.target.value })} placeholder='select date' required />
                    </div>
                    <div className='mt-5 col-6 form-group'>
                        <div className='permissions-role mt-2'>
                        <label className='register-label'>Select Role</label>
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
                    </div>
                    
                   <div className='row'>
                   <div className='mt-3 col-6 form-group'>
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

                    <div className='mt-3 col-6 form-group'>
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
                   </div>

                    <div className='row'>
                    <div className='mt-3 col-6 form-group'>
                    <label className='register-label'>users Permissions</label>
                    <div className='permissions mt-2'>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.users.read}
                                onChange={e => setPermission(prev => ({
                                    ...prev,
                                    users: { ...prev.users, read: e.target.checked }
                                }))}
                            /> Read
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.users.create}
                                onChange={e => setPermission(prev => ({
                                    ...prev,
                                    users: { ...prev.users, create: e.target.checked }
                                }))}
                            /> Create
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.users.update}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    users: { ...permission.users, update: e.target.checked }
                                }))}
                            /> Update
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.users.delete}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    users: { ...permission.users, delete: e.target.checked }
                                }))}
                            /> Delete
                        </label>
                    </div>
                    </div>

                    <div className='mt-3 col-6 form-group'>
                    <label className='register-label'>Attendance Permissions</label>
                    <div className='permissions mt-2'>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.attendance.read}
                                onChange={e => setPermission(prev => ({
                                    ...prev,
                                    attendance: { ...prev.attendance, read: e.target.checked }
                                }))}
                            /> Read
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.attendance.create}
                                onChange={e => setPermission(prev => ({
                                    ...prev,
                                    attendance: { ...prev.attendance, create: e.target.checked }
                                }))}
                            /> Create
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.attendance.update}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    attendance: { ...permission.attendance, update: e.target.checked }
                                }))}
                            /> Update
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={permission.attendance.delete}
                                onChange={e => setPermission(permission => ({
                                    ...permission,
                                    attendance: { ...permission.attendance, delete: e.target.checked }
                                }))}
                            /> Delete
                        </label>
                    </div>
                    </div>
                    </div>
                   
                    <button className='btn mt-5 adminregister-btn'>Register</button>
                </form>
               </div>
            </div>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>
    )
}

export default Adminregister;
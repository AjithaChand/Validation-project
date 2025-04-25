import React, { useContext, useState } from 'react';
import axios from 'axios';
import '../RegisterForm/Adminregister.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiurl } from '../../../../url';
import { UserContext } from '../../../../usecontext';
import { Switch, FormControlLabel } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Adminregister = ({ close }) => {
    const { setCreateNewUser } = useContext(UserContext);
    const [payload, setPayload] = useState({
        branch: "",
        station: "",
        latitude: "",
        longitude: ""
    })

    const handleShow = () => {
        console.log("Payload in frontend", payload);

    }

    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(prev => !prev);
    }

    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        bank_details: '',
        address: '',
        phone_number: '',
        total_salary: 0,
        role: 'user',
        pf_amount: 0,
        esi_amount: 0,
        net_amount: 0,
        gross_salary: 0,
        pf_number: '',
        esi_number: '',
        date: '',
        joining_date: '',
        revised_salary: 0
    });

    const [permission, setPermission] = useState({
        'dashboard': { read: false, create: false, update: false, delete: false },
        'register': { read: false, create: false, update: false, delete: false },
        'user_attendance': { read: false, create: false, update: false, delete: false },
        'payslip': { read: false, create: false, update: false, delete: false },
        'users': { read: false, create: false, update: false, delete: false },
        'attendance': { read: false, create: false, update: false, delete: false },
        'settings': { read: false, create: false, update: false, delete: false },
    });


    const [fullPermission, setFullPermission] = useState({
        read: false,
        create: false,
        update: false,
        delete: false
    })
    const handleFullPermissionToggle = (action) => {
        const newValue = !fullPermission[action];
        setFullPermission(prev => ({ ...prev, [action]: newValue }));

        const updateModule = (module) => {
            const updated = {};

            for (const key in module) {
                if (typeof module[key] === 'boolean') {
                    updated[key] = key === action ? newValue : module[key];
                } else if (typeof module[key] === 'object') {
                    updated[key] = updateModule(module[key]); // Recursively update submodules
                }
            }

            return updated;
        };

        setPermission(prev => {
            const updatedPermissions = {};

            for (const module in prev) {
                updatedPermissions[module] = updateModule(prev[module]);
            }

            return updatedPermissions;
        });
    };



    const toggleFullAccess = (moduleName) => {
        const isFullyChecked = Object.values(permission[moduleName]).every(val => val === true);

        setPermission(prev => ({
            ...prev,
            [moduleName]: {
                create: !isFullyChecked,
                read: !isFullyChecked,
                update: !isFullyChecked,
                delete: !isFullyChecked
            }
        }));
    };
    const toggleParentPermission = (parentKey, childKeys) => {
        const allChecked = ['create', 'read', 'update', 'delete'].every(action =>
            permission[parentKey][action] && childKeys.every(child => permission[child][action])
        );

        const updatedPermissions = { ...permission };

        ['create', 'read', 'update', 'delete'].forEach(action => {
            updatedPermissions[parentKey][action] = !allChecked;
            childKeys.forEach(child => {
                updatedPermissions[child][action] = !allChecked;
            });
        });

        setPermission(updatedPermissions);
    };


    const handleSalarychange = (e) => {

        const salary = parseFloat(e.target.value);
        if (isNaN(salary)) return;

        const leaveDays = 3;

        const pf = salary * 0.12;
        const esi = salary * 0.0075;
        const netSalary = salary - pf - esi;

        console.log(netSalary);

        const workingDays = 30;

        const perDayNetSalary = netSalary / workingDays;
        console.log(perDayNetSalary, "perdaysalary");

        const workedDays = workingDays - leaveDays;
        console.log("WorkedDays", workedDays);

        const revisedNet = perDayNetSalary * workedDays;
        console.log("Revised Salary", revisedNet);

        setValues(prev => ({
            ...prev,
            total_salary: salary,
            gross_salary: salary,
            pf_amount: pf,
            esi_amount: esi,
            net_amount: netSalary,
            revised_salary: revisedNet
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        console.log('Demo output Values', values);
        console.log("Checking address and phone_number", values.address, values.phone_number)
        console.log('Demo output permission', permission);
        console.log('Demo output Branches', payload.station);
        console.log("Final permissions to be sent:", JSON.stringify(permission, null, 2));


        if (values.role === 'select' || values.role === '') {
            return toast.error('Choose the account type');
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(values.email)) {
            return toast.error('Invalid Email');
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{3,}$/;
        if (!passwordRegex.test(values.password)) {
            return toast.warning('Password must be 8 characters, include one number and one special character');
        }

        try {
            await axios.post(`${apiurl}/admin/register`, {
                ...values, payload: payload, permissions: permission
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("Permission updation", permission)
            console.log("Branch", payload)

            try {
                await axios.post(`${apiurl}/email_for_register`, {
                    email: values.email,
                    username: values.username
                });
            } catch (emailErr) {
                console.warn("User registered but email failed:", emailErr);
                toast.warning("User registered but email notification failed");
            }


            toast.success('User registered successfully');
            setCreateNewUser(prev => !prev);
            close();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className='adminregister-container'>
            <div className='adminregister-form'>
                <div className='container'>
                    <form onSubmit={handleSubmit} className='adminform-data'>
                        <h3 className='text-center register-head mb-2'>Register Form</h3>
                        <div className='row'>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Username</label>
                                <input type='text' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, username: e.target.value })} placeholder='Enter your name' required />
                            </div>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Email</label>
                                <input type='email' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, email: e.target.value })} placeholder='Enter your email' required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mt-3 col-md-6 col-sm-12 form-group password-wrapper'>
                                <label className='register-label'>Password</label>
                                <input
                                 type={showPassword ? 'text' : 'password'}
                                    className='form-control password-field'
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                                    onChange={e => setValues({ ...values, password: e.target.value })}
                                    placeholder='Enter your password'
                                    required />
                                <span className="eye-icon" onClick={toggleVisibility}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </span>
                            </div>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Bank Details</label>
                                <input type='text' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, bank_details: e.target.value })} placeholder='Enter your Bank Details' required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Address :</label>
                                <textarea className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, address: e.target.value })} placeholder='Enter your Address'></textarea>
                            </div>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Phone No:</label>
                                <input type='number' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, phone_number: e.target.value })} placeholder='Enter Your Phone number' required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Salary</label>
                                <input type='number' className='form-control' onChange={handleSalarychange} style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} placeholder='Enter salary' required />
                            </div>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Pf Number</label>
                                <input type='number' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, pf_number: e.target.value })} placeholder='Enter Pf number' required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Esi Number</label>
                                <input type='number' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, esi_number: e.target.value })} placeholder='Enter Esi number' required />
                            </div>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Date</label>
                                <input type='date' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, date: e.target.value })} placeholder='select date' required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mt-3 col-12 form-group'>
                                <label className='register-label'>Joiningdate</label>
                                <input type='date' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setValues({ ...values, joining_date: e.target.value })} placeholder='select date' required />
                            </div>

                        </div>
                        <div className='row'>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Branch</label>
                                <input type='text' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setPayload({ ...payload, branch: e.target.value })} placeholder='Enter your branch' required />
                            </div>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>station</label>
                                <input type='text' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setPayload({ ...payload, station: e.target.value })} placeholder='Enter your station' required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>Latitude</label>
                                <input type='float' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setPayload({ ...payload, latitude: e.target.value })} placeholder='Enter latitude number' required />
                            </div>
                            <div className='mt-3 col-md-6 col-sm-12 form-group'>
                                <label className='register-label'>longitude</label>
                                <input type='float' className='form-control' style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }} onChange={e => setPayload({ ...payload, longitude: e.target.value })} placeholder='Enter longitude number' required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mt-3 col-12 form-group'>
                                <div className='permissions-role mt-2'>
                                    <label className='register-label'>Admin</label>
                                    <label>
                                        <input
                                            type='radio'
                                            name='role'
                                            value='user'
                                            onChange={e => setValues({ ...values, role: e.target.value })}
                                            checked={values.role === 'user'}
                                            required
                                        />
                                        No
                                    </label>
                                    <label>
                                        <input
                                            type='radio'
                                            name='role'
                                            value='admin'
                                            onChange={e => setValues({ ...values, role: e.target.value })}
                                            checked={values.role === 'admin'}
                                            required
                                        />
                                        yes
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='mt-3 col-12 form-group'>
                            <div className='permissions-role-table mt-2'>
                                <table className='permission-table text-center'>
                                    <thead>
                                        <tr>
                                            <th>Permissions</th>
                                            <th></th>
                                            <th>Create</th>
                                            <th>Read</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Full permission</td>
                                            <td></td>
                                            {['create', 'read', 'update', 'delete'].map(action => (
                                                <td key={action}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch type='checkbox'
                                                                checked={fullPermission[action]}
                                                                onChange={() => handleFullPermissionToggle(action)} />
                                                        }
                                                    />
                                                </td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <td>Dashboard </td>

                                            <td>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            type="checkbox"
                                                            checked={Object.values(permission.dashboard).every(val => val === true)}
                                                            onChange={() => toggleFullAccess('dashboard')}
                                                        />
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.dashboard.create}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        dashboard: { ...prev.dashboard, create: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.dashboard.read}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        dashboard: { ...prev.dashboard, read: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.dashboard.update}
                                                    onChange={e => setPermission(permission => ({
                                                        ...permission,
                                                        dashboard: { ...permission.dashboard, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.dashboard.delete}
                                                    onChange={e => setPermission(permission => ({
                                                        ...permission,
                                                        dashboard: { ...permission.dashboard, delete: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Register {" "}

                                            </td>

                                            <td>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            type="checkbox"
                                                            checked={Object.values(permission.register).every(val => val === true)}
                                                            onChange={() => toggleFullAccess('register')}
                                                        />
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.register.create}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        register: { ...prev.register, create: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.register.read}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        register: { ...prev.register, read: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.register.update}
                                                    onChange={e => setPermission(permission => ({
                                                        ...permission,
                                                        register: { ...permission.register, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.register.delete}
                                                    onChange={e => setPermission(permission => ({
                                                        ...permission,
                                                        register: { ...permission.register, delete: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Attendance {" "}

                                            </td>

                                            <td>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            type="checkbox"
                                                            checked={
                                                                ['create', 'read', 'update', 'delete'].every(
                                                                    action =>
                                                                        permission.attendance[action] && permission.payslip[action]
                                                                )
                                                            }
                                                            onChange={() => toggleParentPermission('attendance', ['payslip'])}
                                                        />
                                                    }
                                                />
                                            </td>
                                        </tr>


                                        <tr>
                                            <td>Attendance</td>
                                            <td></td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.attendance.create}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        attendance: { ...prev.attendance, create: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.attendance.read}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        attendance: { ...prev.attendance, read: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.attendance.update}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        attendance: { ...prev.attendance, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.attendance.delete}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        attendance: { ...prev.attendance, delete: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Payslip</td>
                                            <td></td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.payslip.create}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        payslip: { ...prev.payslip, create: e.target.checked }
                                                    }))}

                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.payslip.read}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        payslip: { ...prev.payslip, read: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.payslip.update}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        payslip: { ...prev.payslip, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.payslip.delete}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        payslip: { ...prev.payslip, delete: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>User Attendance {" "}

                                            </td>

                                            <td>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            type="checkbox"
                                                            checked={Object.values(permission.user_attendance).every(val => val === true)}
                                                            onChange={() => toggleFullAccess('user_attendance')}
                                                        />
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.user_attendance.create}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        user_attendance: { ...prev.user_attendance, create: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.user_attendance.read}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        user_attendance: { ...prev.user_attendance, read: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.user_attendance.update}
                                                    onChange={e => setPermission(permission => ({
                                                        ...permission,
                                                        user_attendance: { ...permission.user_attendance, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.user_attendance.delete}
                                                    onChange={e => setPermission(permission => ({
                                                        ...permission,
                                                        user_attendance: { ...permission.user_attendance, delete: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Settings {" "}

                                            </td>

                                            <td>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            type="checkbox"
                                                            checked={
                                                                ['create', 'read', 'update', 'delete'].every(
                                                                    action =>
                                                                        permission.settings[action] && permission.users[action]
                                                                )
                                                            }
                                                            onChange={() => toggleParentPermission('settings', ['users'])}
                                                        />
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Settings</td>
                                            <td></td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.settings.create}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        settings: { ...prev.settings, create: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.settings.read}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        settings: { ...prev.settings, read: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.settings.update}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        settings: { ...prev.settings, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.settings.delete}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        settings: { ...prev.settings, delete: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Users</td>
                                            <td></td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.users.create}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        users: { ...prev.users, create: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.users.read}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        users: { ...prev.users, read: e.target.checked }
                                                    }))}

                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.users.update}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        users: { ...prev.users, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.users.delete}
                                                    onChange={e => setPermission(prev => ({
                                                        ...prev,
                                                        users: { ...prev.users, update: e.target.checked }
                                                    }))}
                                                />
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button className='btn mt-4 adminregister-btn'>Register</button>
                        <button className='btn mt-4 adminregister-btn' onClick={handleShow}>Show</button>
                    </form>
                </div>
            </div>
            <ToastContainer position='top-right' autoClose={3000} />
        </div>
    )

}

export default Adminregister;
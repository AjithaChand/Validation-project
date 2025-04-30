import React, { useEffect, useState } from 'react'
import { MdDashboard } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import '../Sidebar/Sidebar.css';
import { FaReceipt } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GiArchiveRegister } from "react-icons/gi";
import { apiurl } from '../../url';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import { Fa500Px } from "react-icons/fa";

const Sidebar = ({ onClose, isVisible, onCloseClick }) => {

    const navigate = useNavigate()

    const location = useLocation()

    const user = localStorage.getItem('role')
    const person_code = localStorage.getItem("person_code")

    const [getPermission, setGetPermission] = useState({})

    const [settings, setSettings] = useState(false)

    const handleSetting = () => {
        setSettings(!settings)
    }

    const [attendance, setAttendance] = useState(false)

    const handleAttendance = () => {
        setAttendance(!attendance)
    }

    const handleClick = (e) => {
        e.stopPropagation()
    }

    useEffect(() => {
        if (person_code) {

            axios.get(`${apiurl}/person-code-details?person_code=${person_code}`)

                .then(res => setGetPermission(res.data.info))
                .catch(err => console.log(err.message))
        }

    }, [person_code])
    console.log(getPermission, "values");

    if (!isVisible) return null;

    return (
        <div className='sidebar-overlay' onClick={onCloseClick}>
            <div className="admin-sidebar" onClick={handleClick}>
                <button className='closebtn' onClick={(e) => {
                    e.stopPropagation();
                    onCloseClick()
                }}>
                    &times;</button>
                {user === "admin" ? (
                    <div className='sidebar-head'>
                        <h4>Admin Panel</h4>
                    </div>
                ) : (
                    <div className='sidebar-head'>
                        <h4>User Panel</h4>
                    </div>
                )}
                <nav>
                    {user === "admin" ? (
                        <ul className='sidebar-ul'>

                            <li className={`sidebar-list ${location.pathname === '/dashboard' && 'sidebar-active'}`}>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard');
                                    onCloseClick()
                                }}>
                                    <MdDashboard className='' />
                                    <span className=''> Dashboard </span>
                                </div>
                            </li>

                            <li className={`sidebar-list ${location.pathname === '/dashboard/register' && 'sidebar-active'}`}>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard/register');
                                    onCloseClick()
                                }}>
                                    <GiArchiveRegister className='' />
                                    <span className=''> Agreements </span>
                                </div>
                            </li>

                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => handleAttendance()}>
                                    <FaCalendarCheck />
                                    <span>Attendance <KeyboardArrowDownIcon className='attendance-icon' /></span>
                                </div>
                            </li>
                            {attendance && (
                                <ul className='sidebar-ul-list'>
                                    <li className={`sidebar-list ${location.pathname === '/dashboard/attendance' && 'sidebar-active'}`}>
                                        <div className='sidebar-icons' onClick={() => {
                                            navigate('/dashboard/attendance');
                                            onCloseClick()
                                        }}>
                                            <FaCalendarCheck />
                                            <span> Attendance</span>
                                        </div>
                                    </li>

                                    <li className={`sidebar-list ${location.pathname === '/dashboard/payslip' && 'sidebar-active'}`}>
                                        <div className='sidebar-icons' onClick={() => {
                                            navigate('/dashboard/payslip');
                                            onCloseClick()
                                        }}>
                                            <FaReceipt />
                                            <span> Payslip</span>
                                        </div>
                                    </li>
                                </ul>
                            )}

                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => handleSetting()}>
                                    <IoSettingsSharp />
                                    <span>Settings <KeyboardArrowDownIcon className='settings-icon' /></span>
                                </div>
                            </li>
                            {settings && (
                                <ul className='sidebar-ul-list'>
                                    <li className={`sidebar-list ${location.pathname === '/dashboard/users' && 'sidebar-active'}`}>
                                        <div className='sidebar-icons' onClick={() => {
                                            navigate('/dashboard/users');
                                            onCloseClick()
                                        }}>
                                            <FaUser />
                                            <span> Users</span>
                                        </div>
                                    </li>

                                    <li className={`sidebar-list ${location.pathname === '/dashboard/settings' && 'sidebar-active'}`}>
                                        <div className='sidebar-icons' onClick={() => {
                                            navigate('/dashboard/settings');
                                            onCloseClick()
                                        }}>
                                            <IoSettingsSharp />
                                            <span> Settings</span>
                                        </div>
                                    </li>
                                </ul>
                            )}

                            <li className='sidebar-list-logout'>
                                <div onClick={() => {
                                    onClose();
                                    onCloseClick()
                                }} className='sidebar-icons'>
                                    <MdLogout className='logout-icon' />
                                    <span>Logout</span>
                                </div>
                            </li>

                        </ul>
                    ) : (
                        <ul className='sidebar-ul'>

                            {getPermission[0]?.can_read === 1 && (
                                <li className={`sidebar-list ${location.pathname === '/dashboard' && 'sidebar-active'}`}>
                                    <div className='sidebar-icons' onClick={() => {
                                        navigate('/dashboard');
                                        onCloseClick()
                                    }}>
                                        <MdDashboard className='' />
                                        <span className=''> Dashboard </span>
                                    </div>
                                </li>
                            )}

                            {getPermission[1]?.can_read === 1 && (
                                <li className={`sidebar-list ${location.pathname === '/dashboard/register' && 'sidebar-active'}`}>
                                    <div className='sidebar-icons' onClick={() => {
                                        navigate('/dashboard/register');
                                        onCloseClick()
                                    }}>
                                        <GiArchiveRegister className='' />
                                        <span className=''> Agreements </span>
                                    </div>
                                </li>
                            )}

                            {getPermission[5]?.can_read === 1 && (
                                <li className='sidebar-list'>
                                    <div className='sidebar-icons' onClick={() => handleAttendance()}>
                                        <FaCalendarCheck />
                                        <span>Attendance <KeyboardArrowDownIcon className='attendance-icon' /></span>
                                    </div>
                                </li>
                            )}
                            {attendance && (
                                <ul className='sidebar-ul-list'>
                                    {getPermission[5]?.can_read === 1 && (
                                        <li className={`sidebar-list ${location.pathname === '/dashboard/attendance' && 'sidebar-active'}`}>
                                            <div className='sidebar-icons' onClick={() => {
                                                navigate('/dashboard/attendance');
                                                onCloseClick()
                                            }}>
                                                <FaCalendarCheck />
                                                <span> Attendance</span>
                                            </div>
                                        </li>
                                    )
                                    }

                                    {getPermission[3]?.can_read === 1 && (
                                        <li className={`sidebar-list ${location.pathname === '/dashboard/payslip' && 'sidebar-active'}`}>
                                            <div className='sidebar-icons' onClick={() => {
                                                navigate('/dashboard/payslip');
                                                onCloseClick()
                                            }}>
                                                <FaReceipt />
                                                <span> Payslip</span>
                                            </div>
                                        </li>
                                    )}

                                </ul>
                            )}

                            {getPermission[2]?.can_read === 1 && (
                                <li className={`sidebar-list ${location.pathname === '/dashboard/userattendance' && 'sidebar-active'}`}>
                                    <div className='sidebar-icons' onClick={() => {
                                        navigate('/dashboard/userattendance');
                                        onCloseClick()
                                    }}>
                                        <Fa500Px />
                                        <span className=''>Userattendance</span>
                                    </div>
                                </li>
                            )}

                            {getPermission[6]?.can_read === 1 && (
                                <li className='sidebar-list'>
                                    <div className='sidebar-icons' onClick={() => handleSetting()}>
                                        <IoSettingsSharp />
                                        <span>Settings <KeyboardArrowDownIcon className='settings-icon' /></span>
                                    </div>
                                </li>
                            )}
                            {settings && (
                                <ul className='sidebar-ul-list'>

                                    {getPermission[4]?.can_read === 1 && (
                                        <li className={`sidebar-list ${location.pathname === '/dashboard/users' && 'sidebar-active'}`}>
                                            <div className='sidebar-icons' onClick={() => {
                                                navigate('/dashboard/users');
                                                onCloseClick()
                                            }}>
                                                <FaUser />
                                                <span> Users</span>
                                            </div>
                                        </li>
                                    )}

                                    {getPermission[6]?.can_read === 1 && (
                                        <li className={`sidebar-list ${location.pathname === '/dashboard/settings' && 'sidebar-active'}`}>
                                        <div className='sidebar-icons' onClick={() => {
                                            navigate('/dashboard/settings');
                                            onCloseClick()
                                        }}>
                                            <IoSettingsSharp />
                                            <span> Settings</span>
                                        </div>
                                    </li>
                                    )}

                                </ul>
                            )}

                            <li className='sidebar-list-logout'>
                                <div onClick={() => {
                                    onClose();
                                    onCloseClick()
                                }} className='sidebar-icons'>
                                    <MdLogout className='logout-icon' />
                                    <span>Logout</span>
                                </div>
                            </li>

                        </ul>
                    )}
                </nav>
            </div>
        </div>
    )
}

export default Sidebar

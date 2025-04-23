import React, { useEffect, useState } from 'react'
import { MdDashboard } from "react-icons/md";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import '../Sidebar/Sidebar.css';
import { FaReceipt } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FaRegUser } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { apiurl } from '../../url';
import axios from 'axios';
import { Fa500Px } from "react-icons/fa";

const Sidebar = ({ onClose, isVisible, onCloseClick }) => {

    const navigate = useNavigate()

    const user = localStorage.getItem('role')
    const person_code = localStorage.getItem("person_code")

    const [getPermission, setGetPermission] = useState({})

    const [settings, setSettings] = useState(false)

    const handleSetting = () => {
        setSettings(!settings)
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
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard');
                                    onCloseClick()
                                }}>
                                    <MdDashboard className='' />
                                    <span className=''> Dashboard </span>
                                </div>
                            </li>
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard/register');
                                    onCloseClick()
                                }}>
                                    <LuNotebookPen className='' />
                                    <span className=''> Register </span>
                                </div>
                            </li>
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard/payslip');
                                    onCloseClick()
                                }}>
                                    <FaReceipt className='' />
                                    <span className=''> payslip</span>
                                </div>
                            </li>
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard/attendance');
                                    onCloseClick()
                                }}>
                                    <FaCalendarCheck className='' />
                                    <span className=''> Attendance</span>
                                </div>
                            </li>
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => handleSetting()}>
                                    <IoSettingsSharp />
                                    <span>Actions <KeyboardArrowDownIcon className='settings-icon' /></span>
                                </div>
                            </li>
                            {settings && (
                                <ul className='sidebar-ul-list'>
                                    <li className='sidebar-list'>
                                        <div className='sidebar-icons' onClick={() => {
                                            navigate('/dashboard/users');
                                            onCloseClick()
                                        }}>
                                            <FaRegUser />
                                            <span> Users</span>
                                        </div>
                                    </li>

                                    <li className='sidebar-list'>
                                        <div className='sidebar-icons' onClick={() => {
                                            navigate('/dashboard/settings');
                                            onCloseClick()
                                        }}>
                                            <FaRegUser />
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
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard');
                                    onCloseClick()
                                }}>
                                    <MdDashboard className='' />
                                    <span className=''> Dashboard </span>
                                </div>
                            </li>
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard/users');
                                    onCloseClick()
                                }}>
                                    <AccountCircleIcon className='' />
                                    <span className=''> Users</span>
                                </div>
                            </li>
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => {
                                    navigate('/dashboard/payslip');
                                    onCloseClick()
                                }}>
                                    <FaReceipt className='' />
                                    <span className=''> payslip</span>
                                </div>
                            </li>
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => navigate('/dashboard/attendance')}>
                                    <FaCalendarCheck className='' />
                                    <span className=''> Attendance</span>
                                </div>
                            </li>
                            {/* <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => navigate('/dashboard/attendance')}>
                                    <FaCalendarCheck className='' />
                                    <span className=''>User Attendance</span>
                                </div>
                            </li> */}
                            {getPermission[4]?.can_read === 1 && (
                                              <li className=" list-style ">
                                                <div className='userdata-btn' onClick={() => navigate('/dashboard/userattendance')}>
                                                  <Fa500Px  />
                                                  <span className='dashboard-icon'>Userattendance</span>
                                                </div>
                                              </li>
                                            )}
                            <li className='sidebar-list'>
                                <div className='sidebar-icons' onClick={() => navigate('/dashboard/settings')}>
                                    <IoIosSettings className='' />
                                    <span className=''>settings</span>
                                </div>
                            </li>
                            <li className='sidebar-list-logout'>
                                <div onClick={onClose} className='sidebar-icons'>
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

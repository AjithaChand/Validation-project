import React from 'react'
import { MdDashboard } from "react-icons/md";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import '../Sidebar/Sidebar.css';
import { FaReceipt } from "react-icons/fa";

const Sidebar = ({ onClose, isVisible, onCloseClick }) => {

    const navigate = useNavigate()

    if (!isVisible) return null;

    return (
        <div className='sidebar-overlay' onClick={onCloseClick}>
            <div className="admin-sidebar">
                <button className='closebtn' onClick={onCloseClick}>&times;</button>
                <div className='sidebar-head'>
                    <h4>Admin Panel</h4>
                </div>
                <nav>
                    <ul className='sidebar-ul'>
                        <li className='sidebar-list'>
                            <div className='sidebar-icons' onClick={() => navigate('/dashboard/adminpage')}>
                                <MdDashboard className='' />
                                <span className=''> Dashboard </span>
                            </div>
                        </li>
                        <li className='sidebar-list'>
                            <div className='sidebar-icons' onClick={() => navigate('/dashboard/users')}>
                                <AccountCircleIcon className='' />
                                <span className=''> Users</span>
                            </div>
                        </li>
                        <li className='sidebar-list'>
                            <div className='sidebar-icons' onClick={() => navigate('/dashboard/payslip')}>
                                <FaReceipt className='' />
                                <span className=''> payslip</span>
                            </div>
                        </li>
                        <li className='sidebar-list-logout'>
                            <div onClick={onClose} className='sidebar-icons'>
                                <MdLogout className='logout-icon' />
                                <span>Logout</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar

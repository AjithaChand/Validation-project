import './Userdata.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import UserDialog from './Dialogbox/UserDialog';
import { useState } from 'react';
import { Menu, } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';
import { Fa500Px } from "react-icons/fa";
import { MdOutlineMenuOpen } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import img from "../AdminDashboard/Payslip/nastaflogo.jpg";

const Userdata = () => {

  const user = localStorage.getItem('role')

  const username = localStorage.getItem("username");

  const navigate = useNavigate()

  const [showconfirm, setShowconfirm] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard sidebar
  const [dashboardSidebaropen, setDashboardSidebaropen] = useState(true)


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const handleLogout = () => {
    setShowconfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/');
  };

  const cancelLogout = () => {
    setShowconfirm(false);
  };

  return (
    <div className='user-container' >
        <div className={`${dashboardSidebaropen ? 'user-profile' : 'toggle-profile'}`}>
          <h3 className='userheader'><span className='caps'>T</span>rust<span className='caps'>A</span>ssure</h3>
          <div className='userlogout-btn'><FaUserCircle className='logo' /></div>
          {user === 'admin' ? (<div className='userlogout-btn username'>{user}</div>) :
           (<div className='userlogout-btn username'>{username}</div>)}
          <button onClick={handleLogout} className='userlogout-btn'>
            <MdLogout className='logoutbutton' />
          </button>
          <div>
            <button className='sidebarmenu-btn' onClick={toggleSidebar}>
              <Menu className="menu-btn" />
            </button>
          </div>
        </div>
        <aside className={`${dashboardSidebaropen ? 'admin-slidebar' : 'toggle-slidebar'}`}>
          <div className='user-heading'>
            {dashboardSidebaropen && <img className="company-logo" src={img} alt="Company Logo" />}
            <button className={`${dashboardSidebaropen ? 'dashboard-menu' : 'toggledashboard-menu'}`}>
              <MdOutlineMenuOpen className='dashboard-menu-btn' onClick={() => setDashboardSidebaropen(!dashboardSidebaropen)} />
            </button>
          </div>
          {user === 'admin' ? (
            <div >
              {dashboardSidebaropen && <h4 className='userdata-head' >Admin Panel</h4>}
            </div>
          ) : (
            <div >
              {dashboardSidebaropen && <h4 className='userdata-head' >User Panel</h4>}
            </div>
          )}
          <nav>
            <ul className='user-list'>
              <li className='list-style'>
                <div className='userdata-btn' onClick={() => navigate('/dashboard')}>
                  <MdSpaceDashboard className='dashboardicons' />
                  {dashboardSidebaropen && <span className='dashboard-icon'> Dashboard </span>}
                </div>
              </li>
              <li className='list-style'>
                <div className='userdata-btn' onClick={() => navigate('/dashboard/users')}>
                  <FaUser  className='dashboardicons' />
                  {dashboardSidebaropen && <span className='dashboard-icon'> Users</span>}
                </div>
              </li>
              <li className='list-style'>
                <div className='userdata-btn' onClick={() => navigate('/dashboard/payslip')}>
                  <IoReceipt  className='dashboardicons' />
                  {dashboardSidebaropen && <span className='dashboard-icon'> Payslip</span>}
                </div>
              </li>
              <li className='list-style'>
                <div className='userdata-btn' onClick={() => navigate('/dashboard/attendance')}>
                  <Fa500Px className='dashboardicons' />
                  {dashboardSidebaropen && <span className='dashboard-icon'> Attendance</span>}
                </div>
              </li>
            </ul>
          </nav>
        </aside>

      <main className={`${dashboardSidebaropen ? 'userdata-container' : 'toggle-container'}`}>
        <Outlet />
      </main>

      <UserDialog isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} />
      <Sidebar isVisible={sidebarOpen} onClose={handleLogout} onCloseClick={toggleSidebar} />
    </div>
  )
}

export default Userdata

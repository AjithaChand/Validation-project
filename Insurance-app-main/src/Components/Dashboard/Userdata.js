import './Userdata.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import UserDialog from './Dialogbox/UserDialog';
import { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FaReceipt } from "react-icons/fa";
import { Menu, } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';

const Userdata = () => {

  const user = localStorage.getItem('role')

  const username = localStorage.getItem("username");

  const navigate = useNavigate()

  const [showconfirm, setShowconfirm] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {user === 'admin' ? (<>
        <div className='user-profile'>
          <h3 className='userheader'><span className='caps'>T</span>rust<span className='caps'>A</span>ssure</h3>
          <div className='userlogout-btn'><FaUserCircle className='logo'/></div>
          <div className='userlogout-btn username'>{user}</div>
          <button onClick={handleLogout} className='userlogout-btn'>
          <MdLogout className='logoutbutton' />
          </button>
          <div>
          <button className='sidebarmenu-btn' onClick={toggleSidebar}>
            <Menu className="menu-btn" />
          </button>
        </div>
        </div>
        <aside className='admin-slidebar'><div className='p-4'>
          <h3 className='userdata-head' >Admin Panel</h3>
        </div>
          <nav>
            <ul className='ps-5 user-list'>
              <li>
                <div className='userdata-btn' onClick={() => navigate('/dashboard/adminpage')}>
                <MdDashboard className='dashboardicons' />{" "}
                  <span className='dashboard-icon'> Dashboard </span>
                </div>
              </li>
              <li>
                <div className='userdata-btn' onClick={() => navigate('/dashboard/users')}>
                <AccountCircleIcon  className='dashboardicons' />{" "}
                  <span className='dashboard-icon'> Users</span>
                </div>
              </li>
              <li>
                <div className='userdata-btn' onClick={() => navigate('/dashboard/payslip')}>
                <FaReceipt  className='dashboardicons' />{" "}
                  <span className='dashboard-icon'> payslip</span>
                </div>
              </li>
            </ul>
          </nav> </aside></>) : user === 'user' ? (<>
            <div className='user-profile'>
              <h3 className='userheader'><span className='caps'>T</span>rust<span className='caps'>A</span>ssure</h3>
              <div className='userlogout-btn'><FaUserCircle   className='logo' /></div>
              <div className='userlogout-btn username'>{username}</div>
              <button onClick={handleLogout} className='userlogout-btn'>
              <MdLogout className='logoutbutton'/>
              </button>
            </div>
            <aside className='admin-slidebar'>
              <div className='p-4'>
                <h3 className='userdata-head' >User Panel</h3>
              </div>
              <nav>
                <ul className='ps-5 user-list'>
                  <li>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard/home')}>
                    <MdDashboard  className='dashboardicons' />{" "}
                      <span className='dashboard-icon'> Dashboard</span>
                    </div>
                  </li>
                  <li>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard/payslipUser')}>
                    <FaReceipt  className='dashboardicons' />{" "}
                      <span className='dashboard-icon'> Payslip</span>
                    </div>
                  </li>
                </ul>
              </nav>
            </aside>
          </>
          ) : (<></>)}
      <main className='userdata-container'>
        <Outlet />
      </main>

      <UserDialog isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} />
      <Sidebar  isVisible={sidebarOpen} onClose={handleLogout} onCloseClick={toggleSidebar}  />
    </div>
  )
}

export default Userdata

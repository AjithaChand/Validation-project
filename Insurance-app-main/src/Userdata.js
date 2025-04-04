import './Userdata.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import UserDialog from './UserDialog';
import { useState } from 'react';


const Userdata = () => {

  const user = localStorage.getItem('role')

  const username = localStorage.getItem("username");

  const navigate = useNavigate()

   const [showconfirm, setShowconfirm] = useState(false);

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
    <div className='user-container'>
        {user === 'admin' ? (<>
        <div className='user-profile'>
                    <h3 className='userheader'>TrustAssure</h3>
                    <div className='userlogout-btn'><FaUserCircle size={34} color="black" style={{ cursor: "pointer" }} /></div>
                    <div className='userlogout-btn username'>{user}</div>
                    <button onClick={handleLogout} className='userlogout-btn'>
                      <MdLogout size={30} color="darkred" style={{ cursor: "pointer" }} />
                    </button>
                  </div>
         <aside className='admin-slidebar'><div className='p-4'>
          <h3 className='userdata-head' >Admin Panel</h3>
        </div>
          <nav>
            <ul className='ps-5'>
              <li>
                <button className='userdata-btn' onClick={() => navigate('/dashboard/adminpage')}>
                  Dashboard
                </button>
              </li>
              <li>
                <button className='userdata-btn' onClick={() => navigate('/dashboard/users')}>
                  Users
                </button>
              </li>
            </ul>
          </nav> </aside></>) : user === 'user' ? (<>
            <div className='user-profile'>
                    <h3 className='userheader'>TrustAssure</h3>
                    <div className='userlogout-btn'><FaUserCircle size={34} color="black" style={{ cursor: "pointer" }} /></div>
                    <div className='userlogout-btn username'>{username}</div>
                    <button onClick={handleLogout} className='userlogout-btn'>
                      <MdLogout size={30} color="darkred" style={{ cursor: "pointer" }} />
                    </button>
                  </div>
          <aside className='admin-slidebar'>
            <div className='p-4'>
              <h3 className='userdata-head text-center' >User Panel</h3>
            </div>
            <nav>
              <ul className='ps-5 user-list'>
                <li>
                  <button className='userdata-btn' onClick={() => navigate('/dashboard/home')}>
                    Dashboard
                  </button>
                </li>
              </ul>
            </nav>
            </aside>
          </>
        ) : (  <></>)}
      <main className='userdata-container'>
        <Outlet />
      </main>

      <UserDialog  isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} />
    </div>
  )
}

export default Userdata

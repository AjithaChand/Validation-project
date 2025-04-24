import './Userdata.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import UserDialog from './Dialogbox/UserDialog';
import { useContext, useEffect, useState } from 'react';
import { Menu, } from "lucide-react";
import Sidebar from '../Sidebar/Sidebar';
import { Fa500Px } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import axios from 'axios';
import { apiurl } from '../../url';
import { toast } from 'react-toastify';
import { UserContext } from '../../usecontext';
import { LuCalendarCheck } from "react-icons/lu";
import { LuNotebookPen } from "react-icons/lu";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Userdata = () => {

  const { refreshSetting } = useContext(UserContext);

  const location = useLocation()

  const [settings, setSettings] = useState(false)

  const handleSetting = () => {
      setSettings(prev => !prev)
  }

  const [settingspayslip, setSettingspayslip] = useState(false)

  const handleSettingpayslip = () => {
    setSettingspayslip(prev => !prev);
  }

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    address: "",
    logo: null,
  });

  // const [existingLogo, setExistingLogo] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/company-details`);
        const data = res.data;
        console.log(data);


        setFormData({
          companyName: data.company_name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          logo: data.logo_url,
        });

        // setExistingLogo(data.logo_url); 
      } catch (err) {
        console.error("Error fetching company details:", err);
        toast.error("Failed to load company data");
      }
    };

    fetchCompanyDetails();
  }, [refreshSetting]);

  const person_code = localStorage.getItem("person_code")

  const [getPermission, setGetPermission] = useState({})

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

  useEffect(() => {
    if (person_code) {

      axios.get(`${apiurl}/person-code-details?person_code=${person_code}`)

        .then(res => setGetPermission(res.data.info))
        .catch(err => console.log(err.message))
    }

  }, [person_code])
  console.log(getPermission, "values");

  return (
    <div className='user-container' >
      <div className={`${dashboardSidebaropen ? 'user-profile' : 'toggle-profile'}`}>
        <img className={`company-logo-heading ${dashboardSidebaropen ? 'company-logo-head' : 'company-logo-header'}`} src={formData.logo} alt="Company Logo" />
        <h3 className={`user-header ${dashboardSidebaropen ? 'userheader' : 'userheader-toggle'}`}>{formData.companyName}</h3>
        <h3 className='userheader-res'>Nastaf</h3>
        <div className='userlogout-btn'><FaRegUser className='logo' /></div>
        {user === 'admin' ? (<div className={`userlogout-btn ${dashboardSidebaropen ? 'username-admin' : 'username-toggle'}`}>{user}</div>) :
          (<div className={`userlogout-btn ${dashboardSidebaropen ? 'username-admin' : 'username-toggle'}`}>{username}</div>)}
        <button onClick={handleLogout} className='userlogout-btn'>
          <MdLogout className='logoutbutton' />
        </button>
        <div>
          <button className='sidebarmenu-btn' onClick={toggleSidebar}>
            <Menu className="menu-btn" />
          </button>
        </div>
      </div>

      <div className='slidebar-container'>
        <div className={`${dashboardSidebaropen ? 'admin-slidebar' : 'toggle-slidebar'}`}>
          <div className='user-heading'>
            {dashboardSidebaropen && <img className="company-logo" src={formData.logo} alt="Company Logo" />}
            <h4 className={`${dashboardSidebaropen ? 'sidebar-companyname' : 'sidebar-companyname-toggle'}`}>Nastaf</h4>
            <button className={`${dashboardSidebaropen ? 'dashboard-menu' : 'toggledashboard-menu'}`}>
              <AiOutlineMenu className='dashboard-menu-btn' onClick={() => setDashboardSidebaropen(!dashboardSidebaropen)} />
            </button>
          </div>
          {user === 'admin' ? (
            <div className='mt-2'>
              {dashboardSidebaropen && <p className='userdata-head' >ADMIN PANEL</p>}
            </div>
          ) : (
            <div >
              {dashboardSidebaropen && <h6 className='userdata-head' >USER PANEL</h6>}
            </div>
          )}
          <nav>
            {user === "admin" ? (
              <ul className='user-list'>
                <li className={` list-style ${location.pathname === '/dashboard' && 'active'}`}>
                  <div className='userdata-btn' onClick={() => navigate('/dashboard')}>
                    <RxDashboard className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                    {dashboardSidebaropen && <span className='dashboard-icon'> Dashboard </span>}
                  </div>
                </li>
                <li className={` list-style ${location.pathname === '/dashboard/register' && 'active'}`}>
                  <div className='userdata-btn' onClick={() => navigate('/dashboard/register')}>
                    <LuNotebookPen className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                    {dashboardSidebaropen && <span className='dashboard-icon'> Register </span>}
                  </div>
                </li>
                {/* <li className={` list-style ${location.pathname === '/dashboard/payslip' && 'active'}`}>
                  <div className='userdata-btn' onClick={() => navigate('/dashboard/payslip')}>
                    <IoReceiptOutline className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                    {dashboardSidebaropen && <span className='dashboard-icon'> Payslip</span>}
                  </div>
                </li> */}
                {/* <li className={` list-style ${location.pathname === '/dashboard/attendance' && 'active'}`}>
                  <div className='userdata-btn' onClick={() => navigate('/dashboard/attendance')}>
                    <LuCalendarCheck className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                    {dashboardSidebaropen && <span className='dashboard-icon'> Attendance</span>}
                  </div>
                </li> */}
                <li className={` list-style ${location.pathname === '/dashboard/attendance' && 'active'}`}>
                  <div className='userdata-btn' onClick={() => {
                    handleSettingpayslip();
                    navigate('/dashboard/attendance');
                  }}>
                    <LuCalendarCheck className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                    {dashboardSidebaropen && <span className='dashboard-icon'> Attendance <KeyboardArrowDownIcon className='attendance-icon' />
                      </span>}
                  </div>
                </li>
                {settingspayslip && (dashboardSidebaropen || !dashboardSidebaropen) && (
                  <ul className={`${dashboardSidebaropen ? " " : "'user-list-toggle'"}`}>
                    <li className={`list-style-users list-style ${location.pathname === '/dashboard/payslip' && 'active'}`}>
                      <div className='userdata-btn' onClick={() => navigate('/dashboard/payslip')}>
                        <IoReceiptOutline className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                        {dashboardSidebaropen && <span className='dashboard-icon'> Payslip</span>}
                      </div>
                    </li>
                  </ul>
                )}
                <li className={` list-style ${location.pathname === '/dashboard/settings' && 'active'}`}>
                  <div className='userdata-btn' onClick={() => {
                    handleSetting()
                    navigate('/dashboard/settings');
                  }}>
                    <IoSettingsOutline className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                    {dashboardSidebaropen && <span className='dashboard-icon'>Settings <KeyboardArrowDownIcon className='settings-icon' />
                    </span>}
                  </div>
                </li>
                {settings && (dashboardSidebaropen || !dashboardSidebaropen) && (
                  <ul className={`${dashboardSidebaropen ? " " : "'user-list-toggle'"}`}>
                    <li className={`list-style-users list-style ${location.pathname === '/dashboard/users' && 'active'}`}>
                      <div className='userdata-btn' onClick={() => navigate('/dashboard/users')}>
                        <FaRegUser className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                        {dashboardSidebaropen && <span className='dashboard-icon'> Users</span>}
                      </div>
                    </li>
                  </ul>
                )}
              </ul>

            ) : (
              <ul className='user-list'>
                {getPermission[0]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard')}>
                      <RxDashboard className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'> Dashboard </span>}
                    </div>
                  </li>
                )}

                {getPermission[0]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard/register' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard/register')}>
                      <LuNotebookPen className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'> Register </span>}
                    </div>
                  </li>
                )}

                {/* {getPermission[2]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard/users' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard/users')}>
                      <FaRegUser className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'> Users</span>}
                    </div>
                  </li>
                )} */}

                {/* {getPermission[1]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard/payslip' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard/payslip')}>
                      <IoReceiptOutline className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'> Payslip</span>}
                    </div>
                  </li>
                )} */}

                {/* {getPermission[3]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard/attendance' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard/attendance')}>
                      <LuCalendarCheck className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'> Attendance</span>}
                    </div>
                  </li>
                )} */}

                {getPermission[3]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard/attendance' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => {
                      handleSettingpayslip()
                      navigate('/dashboard/attendance');
                    }}>
                      <LuCalendarCheck className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'> Attendance <KeyboardArrowDownIcon className='attendance-icon' /></span>}
                    </div>
                  </li>
                )}{settingspayslip && dashboardSidebaropen && (
                  <ul>
                    <li className={` list-style ${location.pathname === '/dashboard/payslip' && 'active'}`}>
                      <div className='userdata-btn' onClick={() => navigate('/dashboard/payslip')}>
                        <IoReceiptOutline className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                        {dashboardSidebaropen && <span className='dashboard-icon'> Payslip</span>}
                      </div>
                    </li>
                  </ul>
                )}

                {getPermission[4]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard/userattendance' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => navigate('/dashboard/userattendance')}>
                      <Fa500Px className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'>Userattendance</span>}
                    </div>
                  </li>
                )}

                {getPermission[5]?.can_read === 1 && (
                  <li className={` list-style ${location.pathname === '/dashboard/settings' && 'active'}`}>
                    <div className='userdata-btn' onClick={() => {
                      handleSetting()
                      navigate('/dashboard/settings');
                    }}>
                      <IoSettingsOutline className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                      {dashboardSidebaropen && <span className='dashboard-icon'>
                        Settings <KeyboardArrowDownIcon className='settings-icon' />
                      </span>}
                    </div>
                  </li>
                )}
                {settings && dashboardSidebaropen && (
                  <ul>
                    <li className={` list-style ${location.pathname === '/dashboard/users' && 'active'}`}>
                      <div className='userdata-btn' onClick={() => navigate('/dashboard/users')}>
                        <FaRegUser className={`${dashboardSidebaropen ? 'dashboardicons' : 'toggledashboard-icons'}`} />
                        {dashboardSidebaropen && <span className='dashboard-icon'> Users</span>}
                      </div>
                    </li>
                  </ul>
                )}
              </ul>
            )}
          </nav>
        </div>
      </div>

      <main className={`${dashboardSidebaropen ? 'userdata-container' : 'toggle-container'}`}>
        <Outlet />
      </main>

      <UserDialog isVisible={showconfirm} onClose={handleLogout} cancel={cancelLogout} logout={confirmLogout} />
      <Sidebar isVisible={sidebarOpen} onClose={handleLogout} onCloseClick={toggleSidebar} />
    </div>
  )
}

export default Userdata

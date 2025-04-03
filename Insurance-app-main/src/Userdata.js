import './Userdata.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";

const Userdata = () => {

  const user = localStorage.getItem('role')

  const navigate = useNavigate()

  return (
    <div className='user-container'>
        {user === 'admin' ? (<> <aside className='admin-slidebar'><div className='p-4'>
          <h3 className='userdata-head' >Admin Panel</h3>
        </div>
          <nav>
            <ul className='ps-5 userlist'>
              <li>
                <button className='userdata-btn' onClick={() => navigate('/admin/adminpage')}>
                  Dashboard
                </button>
              </li>
              <li>
                <button className='userdata-btn' onClick={() => navigate('/admin/users')}>
                  Users
                </button>
              </li>
            </ul>
          </nav> </aside></>) : user === 'user' ? (<><aside className='admin-slidebar'>
            <div className='p-4'>
              <h3 className='userdata-head text-center' >User Panel</h3>
            </div>
            <nav>
              <ul className=' userlist'>
                <li>
                  <button className='userdata-btn' onClick={() => navigate('/admin/home')}>
                  <MdDashboard size={28} color="whitesmoke" style={{ cursor: "pointer" }} /> Dashboard
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
    </div>
  )
}

export default Userdata

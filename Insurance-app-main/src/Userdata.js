import './Userdata.css'
import { Outlet, useNavigate } from 'react-router-dom'

const Userdata = () => {

  const navigate = useNavigate()

  return (
    <div className='user-container'>
      <aside className='admin-slidebar'>
        <div className='p-4'>
          <h3 >Admin Panel</h3>
        </div>
        <nav>
          <ul className='ps-5'>
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
        </nav>
      </aside>
      <main className='userdata-container'>
          <Outlet/>
      </main>
    </div>
  )
}

export default Userdata

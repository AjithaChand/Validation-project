import './Userdata.css'
import Adminpage from './Adminpage'
import Users from './Users'
import { useNavigate } from 'react-router-dom'

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
              <button className='userdata-btn' onClick={() => navigate('/adminpage')}>
                Dashboard
              </button>
            </li>
            <li>
              <button className='userdata-btn' onClick={() => navigate('/users')}>
                Users
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
          {navigate==='/adminpage' && <Adminpage/>}
          {navigate==='/users' && <Users/>}
      </main>
    </div>
  )
}

export default Userdata

import { useState } from 'react'
import './Userdata.css'
import Adminpage from './Adminpage'
import Users from './Users'

const Userdata = () => {

  const [src,setSrc] = useState("/adminpage")

  return (
    <div className='user-container'>
      <aside className='admin-slidebar'>
        <div className='p-4'>
          <h3 >Admin Panel</h3>
        </div>
        <nav>
          <ul className='ps-5'>
            <li><a className='userdata-btn' onClick={()=>{setSrc('/adminpage')}}>Dashboard</a></li>
            <li><a className='userdata-btn' onClick={()=>{setSrc('/users')}}>Users</a></li>
          </ul>
        </nav>
      </aside>
      <main>
          {src==='/adminpage' && <Adminpage/>}
          {src==='/users' && <Users/>}
      </main>
    </div>
  )
}

export default Userdata

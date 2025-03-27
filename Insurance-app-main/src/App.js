import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Userdata from './Userdata'
import Create from './Create'
import Register from './Register'
import User from './User'
import Adminpage from './Adminpage'
import Userpage from './Userpage'
import Adminregister from './Adminregister'
import Users from './Users'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/admin' element={<Userdata />} />
          <Route path='/user' element={<Create/>} />
          <Route path='/home' element={<User />} />
          <Route path='/adminpage' element={<Adminpage />} />
          <Route path='/userpage' element={<Userpage />} />
          <Route path='/adminregister' element={<Adminregister />} />
          <Route path='/users' element={<Users />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

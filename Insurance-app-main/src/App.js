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
import FileViewer from './Fileviewer'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/user' element={<Create/>} />
          <Route path='/home' element={<User />} />

          <Route path='/admin' element={<Userdata />} >
            <Route index element={<Adminpage />} />
            <Route path='adminpage' element={<Adminpage />} />
            <Route path='users' element={<Users />} />
          </Route>
          <Route path='/adminregister' element={<Adminregister />} />
          <Route path='/userpage' element={<Userpage />} />
          <Route path='/fileview' element={<FileViewer />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

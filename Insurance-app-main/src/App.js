import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Userdata from './Userdata';
import Create from './Create';
import Register from './Register';
import User from './User';
import Adminpage from './Adminpage';
import Userpage from './Userpage';
import Adminregister from './Adminregister';
import Users from './Users';
import Homepage from './Homepage';
import Updatedata from './Updatedata';
import { UserProvider } from "./usecontext";  
const App = () => {
return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user' element={<Create />} />
          <Route path='/home' element={<User />} />
          <Route path='/dashboard' element={<Userdata />}>
            <Route index element={<Adminpage />} />
            <Route path='adminpage' element={<Adminpage />} />
            <Route path='users' element={<Users />} />
            <Route path='home' element={<User />} />
          </Route>
          <Route path='/getuser/:id' element={<Users />} />
          <Route path='/edituser/:id' element={<Updatedata />} />
          <Route path='/adminregister' element={<Adminregister />} />
          <Route path='/userpage' element={<Userpage />} />
         
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

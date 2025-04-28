import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Userdata from './Components/Dashboard/Userdata';
import Create from './Components/Admincreateform/Create';
import Register from './Components/Register/Register';

import Adminpage from './Components/AdminDashboard/CustomerDetails/Adminpage';
import Userpage from './Components/AdminDashboard/AdminRegistration/Dialogbox/Userpage';
import Adminregister from './Components/AdminDashboard/AdminRegistration/RegisterForm/Adminregister';
import Users from './Components/AdminDashboard/AdminRegistration/Users';
import Updatedata from './Components/AdminDashboard/AdminRegistration/Updateform/Updatedata';
import { UserProvider } from "./usecontext";  
import Updatefile from './Components/Admincreateform/Updatefile';
import Payslip from './Components/AdminDashboard/Payslip/payslip';
import Attendance from './Components/AdminDashboard/Attendance/attendance';
import UserAttendance from './Components/AdminDashboard/AdminRegistration/Updateform/userattendance';
import CompanyDetailsForm from './Components/NewSetting';
import Dashboard from './Components/AdminDashboard/DashboardAdmin/Dashboard';

const App = () => {
return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user' element={<Create />} />
          {/* <Route path='/home' element={<User />} /> */}
          <Route path='/dashboard' element={<Userdata />}>
            <Route index element={<Dashboard />} />
            <Route path='' element={<Dashboard />} />
            <Route path='register' element={<Adminpage />} />
            <Route path='users' element={<Users />} />
            {/* <Route path='home' element={<User />} /> */}
            <Route path='payslip' element={<Payslip />} />
       
            <Route path="attendance" element={<Attendance/>}/>
            
            <Route path="userattendance" element={<UserAttendance />} />
            <Route path="settings" element={<CompanyDetailsForm />} />

          </Route>
          <Route path='/getuser/:id' element={<Users />} />
          <Route path='/edituser/:id' element={<Updatedata />} />
          <Route path='/adminregister' element={<Adminregister />} />
          <Route path='/userpage' element={<Userpage />} />
          <Route path="/update-user/:id" element={<Updatefile />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

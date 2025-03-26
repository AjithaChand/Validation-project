import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import Userdata from './userdata';
import Create from '../create';
import Register from './register';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />-
          <Route path='/register' element={<Register/>} />
          <Route path='/admin' element={<Userdata />} />
          <Route path='/user' element={<Create/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;

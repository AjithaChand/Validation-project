import React, { useEffect, useState } from 'react';
import "./attendance.css";
import axios from 'axios';
import { apiurl } from '../../../url';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    axios.get(`${apiurl}/get_attendance_datas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setAttendanceData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className='attendance-container'>
      <h1>Attendance</h1>
      <div className='attendance'>
        <table className='attend-1'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Working Days</th>
              <th>Week Off</th>
              <th>Leave Days</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((data, index) => (
              <tr key={index}>
                <td>{data.emp_name}</td>
                <td>{data.emp_email}</td>
                <td>30</td> 
                <td>4</td>  
                <td>{data.leave_days}</td>
              </tr>
            ))}
          </tbody>  
        </table>
      </div>
    </div>
  );
};

export default Attendance;

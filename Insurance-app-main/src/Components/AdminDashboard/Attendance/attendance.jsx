import React, { useEffect,useState } from 'react'
import "./attendance.css"
import axios from 'axios';
import { apiurl } from '../../../url';
const Attendance = () => {
 const [attendanceData, setAttendanceData] = useState([]);
 const[salary,setSalary]=useState(10000);
useEffect(() => {
    axios.get(`${apiurl}/attedance_data`, {
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
                    <th>Salary</th>
                    <th>Esi No</th>
                    <th>Pf No</th>
                    <th>working Days</th>
                    </tr> 
                    </thead>
                    <tbody>
                    <tr>
                        <td>Nandhini</td>
                        <td>nandhini@gmail.com</td>
                        <td>10000</td>
                        <td>121000388110001302</td>
                        <td>NASTAF639000</td>
                        <td>28</td>
                    </tr>
                    </tbody>  
                     </table>
      </div>
    </div>
  )
}

export default Attendance

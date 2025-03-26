import React, { useEffect, useState } from 'react'
import './userdata.css';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Userdata = () => {

  const navigate = useNavigate()

  const [value, setValue] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000')
      .then(res => setValue(res.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className='user-container'>
        <h3 className='text-center'  style={{paddingTop:"50px"}}>Userdata</h3>
        <table className='mt-5' border={1}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Policy</th>
              <th>File Upload</th>
            </tr>
          </thead>
          <tbody>
            {value.map((data, index) => {
              return <tr key={index}>
                <td>{data.email}</td>
                <td>{data.startdate}</td>
                <td>{data.enddate}</td>
                <td>{data.policy}</td>
                <td>{data.file}</td>
              </tr>
            })}
          </tbody>
        </table>
        <button className='btn mt-5' style={{ width: "10%" }} onClick={() => navigate('/create')} >CreateData</button>
    </div>
  )
}

export default Userdata;

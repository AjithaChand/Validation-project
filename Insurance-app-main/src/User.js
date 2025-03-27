import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './User.css';
import Formpopup from './Formpopup';

const User = () => {

    const [showform,setShowform] = useState(false)

    const toggleForm = () =>{
      setShowform(!showform)
    }

    const [value, setValue] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8000')
        .then(res => setValue(res.data))
        .catch(err => console.log(err))
    }, [])
  
    return (
      <div className='user-container'>
          <h3 className='text-center'  style={{paddingTop:"50px"}}>User Entry</h3>
          <table className='mt-5' border={1}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Policy</th>
                <th>Files</th>
                <th>Action</th>
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
                  <td><button>Edit</button></td>
                </tr>
              })}
            </tbody>
          </table>
          <div className='mt-5'>
            <button className='btn user-btn' onClick={toggleForm}>Add Details</button>
          </div>
          <Formpopup isVisible={showform} onClose={toggleForm} />
      </div>
    )
}

export default User

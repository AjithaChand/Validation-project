import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { apiurl } from '../../url';
import "./Task.css"

const Task = () => {
  const [crmdata, setCrmdata] = useState([]);

  const getCrmdata = async () => {
    try {
      const response = await axios.get(`${apiurl}/get-all-tasks`);
      setCrmdata(response.data);
      console.log("ressssssssssss",response.data);
    } catch (error) {
      console.error("error getting data", error);
    }
  };

  useEffect(() => {
    getCrmdata();
  }, []);

  return (
    <>
    
    <div className='crm-table'>
      <div className='crm details'>
      <table className='task-table'>
        <thead>
          <tr>
            <th>Emp Id</th>
            <th>Name</th>
            <th>Task Given</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {crmdata.map((task, index) => (
            <tr key={index}>
              <td>{task.emp_id}</td>
              <td>{task.emp_name}</td>
              <td>{task.task}</td>
              <td>{task.start_date}</td>
              <td>{task.end_date}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </>
  );
};

export default Task;





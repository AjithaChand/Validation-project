import axios from 'axios';
import React, {useEffect, useState } from 'react';
import { apiurl } from '../../url';

const Usercrm = () => {
  const [singlecrmdata, setSingleCrmdata] = useState([]);
  const email=localStorage.getItem("email")
  console.log(email)


  const getSingleCrmdata = async () => {
    try {
      if (!email) {
        console.error("User ID not found in context");
        return;
      }
      const response = await axios.get(`${apiurl}/get-single-crm-task?email=${email}`);
      setSingleCrmdata(response.data);
      console.log("CRM single user", response.data);
    } catch (error) {
      console.error("Error getting CRM data:", error);
    }
  };


  useEffect(() => {
    getSingleCrmdata();
  }, []);

  return (
    <div className='crm-table'>
      <div className='crm details'>
        <table className='crm-table'>
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
            {singlecrmdata.map((task, index) => (
              <tr key={index}>
                <td>{task.emp_id}</td>
                <td>{task.emp_name}</td>
                <td>{task.task}</td>
                <td>{new Date(task.start_date).toISOString().split('T')[0]}</td>
                <td>{new Date(task.end_date).toISOString().split('T')[0]}</td>
                <td>
                 tftyg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usercrm;

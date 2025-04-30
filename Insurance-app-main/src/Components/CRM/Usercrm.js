import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiurl } from '../../url';
import "./Usercrm.css"
// import HolidayCalendar from './Holidays';

const Usercrm = () => {
  const [singlecrmdata, setSingleCrmdata] = useState([]);
  const email = localStorage.getItem("email");
  console.log(email);

  const getSingleCrmdata = async () => {
    try {
      if (!email) {
        console.error("User email not found in localStorage");
        return;
      }
      const response = await axios.get(`${apiurl}/get-single-crm-task?email=${email}`);
      setSingleCrmdata(response.data);
      console.log("CRM single user", response.data);
    } catch (error) {
      console.error("Error getting CRM data:", error);
    }
  };

  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'Not Started':
        return ["Not started",'In Progress', 'On Hold'];
      case 'In Progress':
        return ['On Hold', 'Completed'];
      case 'On Hold':
        return ['In Progress'];
      case 'Completed':
        return ['Completed'];
      default:
        return [];
    }
  };
  
  const handleStatusChange = async (index, newStatus) => {
    const updatedData = [...singlecrmdata];
    updatedData[index].status = newStatus;
    setSingleCrmdata(updatedData);
  
    const taskId = updatedData[index].task_id;
  
    try {
      await axios.patch(`${apiurl}/update-task-status`, {
        taskId: taskId,
        status: newStatus,
      });
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status on backend:", error);
    }
  };
  


  

  useEffect(() => {
    getSingleCrmdata();
  }, []);

  return (
    <div className='crm-table'>
      {/* <HolidayCalendar/> */}
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
                <select value={task.status} onChange={(e) => handleStatusChange(index, e.target.value)} 
                 disabled={getStatusOptions(task.status).length === 0}
>                {getStatusOptions(task.status).map((statusOption) => (
                 <option key={statusOption} value={statusOption}>
                 {statusOption}
                 </option>
                 ))}
                 </select>

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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiurl } from '../../../url';
import { toast } from 'react-toastify';
import "./Dashboard.css"

const Dashboard = () => {
  const[presentusers,setPresentusers]=useState("");
  const[absentusers,setAbsentusers]=useState("");
  const[leaveusers,setLeaveusers]=useState("");
  const [total, setTotal] = useState({
    present_count: 0,
    absent_count: 0,
    no_record_count: 0,
  });

  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await axios.get(`${apiurl}/total-information?date=${today}`);
      if (response.data) {
        setTotal(response.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleGet = async (type) => {
    const today = new Date().toISOString().split('T')[0]; // fixed 'T'
  
    try {
      let response;
      if (type === "present") {
        response = await axios.get(`${apiurl}/get-present-user`, {
          params: { date: today }, // GET requests use 'params'
        });
        setPresentusers(response.data);
      } else if (type === "absent") {
        response = await axios.get(`${apiurl}/get-absent-user`, {
          params: { date: today },
        });
        setAbsentusers(response.data);
      } else if (type === "leave") {
        response = await axios.get(`${apiurl}/get-leave-user`);
        setLeaveusers(response.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

 

  return (
    <div>
     <div className="dashboard-summary">
  <div
    className="summary-item"
    onMouseEnter={() => handleGet('present')}
  >
    <h3>No. of Present: <span>{total.present_count}</span></h3>
    {presentusers.length > 0 && (
      <div className="hover-box">
        {presentusers.map((u, i) => (
          <div key={i}>{u.emp_name}</div>
        ))}
      </div>
    )}
  </div>

  <div
    className="summary-item"
    onMouseEnter={() => handleGet('absent')}
  >
    <h3>No. of Absent: <span>{total.absent_count}</span></h3>
    {absentusers.length > 0 && (
      <div className="hover-box">
        {absentusers.map((u, i) => (
          <div key={i}>{u.emp_name}</div>
        ))}
      </div>
    )}
  </div>

  <div
    className="summary-item"
    onMouseEnter={() => handleGet('leave')}
  >
    <h3>Unknown Records: <span>{total.no_record_count}</span></h3>
    {leaveusers.length > 0 && (
      <div className="hover-box">
        {leaveusers.map((u, i) => (
          <div key={i}>{u.emp_name}</div>
        ))}
      </div>
    )}
  </div>
</div>
</div>
  );
};

export default Dashboard;

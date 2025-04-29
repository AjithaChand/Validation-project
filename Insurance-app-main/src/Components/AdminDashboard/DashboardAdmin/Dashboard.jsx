import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiurl } from '../../../url';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [presentUsers, setPresentUsers] = useState([]);
  const [absentUsers, setAbsentUsers] = useState([]);
  const [leaveUsers, setLeaveUsers] = useState([]);
  const [visibleBox, setVisibleBox] = useState(null); 

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

  const handleBoxClick = async (type) => {
    const today = new Date().toISOString().split('T')[0];
    setVisibleBox(prev => (prev === type ? null : type));

    try {
      let response;
      if (type === 'present') {
        response = await axios.get(`${apiurl}/get-present-user?date=${today}`);
        setPresentUsers(response.data);
      } else if (type === 'absent') {
        response = await axios.get(`${apiurl}/get-absent-user?date=${today}`);
        setAbsentUsers(response.data);
      } else if (type === 'leave') {
        response = await axios.get(`${apiurl}/get-leave-user`);
        setLeaveUsers(response.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-box" onClick={() => handleBoxClick('present')}>
        <h3>Present: <span>{total.present_count}</span></h3>
        {visibleBox === 'present' && presentUsers.length > 0 && (
          <div className="user-list">
            {presentUsers.map((u, i) => (
              <div key={i}>{u.emp_name}</div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-box" onClick={() => handleBoxClick('absent')}>
        <h3>Absent: <span>{total.absent_count}</span></h3>
        {visibleBox === 'absent' && absentUsers.length > 0 && (
          <div className="user-list">
            {absentUsers.map((u, i) => (
              <div key={i}>{u.emp_name}</div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-box" onClick={() => handleBoxClick('leave')}>
        <h3>Unknown: <span>{total.no_record_count}</span></h3>
        {visibleBox === 'leave' && leaveUsers.length > 0 && (
          <div className="user-list">
            {leaveUsers.map((u, i) => (
              <div key={i}>{u.emp_name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

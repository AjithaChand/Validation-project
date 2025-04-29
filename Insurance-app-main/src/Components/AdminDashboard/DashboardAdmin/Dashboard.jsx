import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiurl } from '../../../url';
import { toast } from 'react-toastify';
import './Dashboard.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [presentUsers, setPresentUsers] = useState([]);
  const [absentUsers, setAbsentUsers] = useState([]);
  const [leaveUsers, setLeaveUsers] = useState([]);
  const [visibleBox, setVisibleBox] = useState(null);
  const [expiringUsers, setExpiringUsers] = useState([]);
  const [total, setTotal] = useState({
    present_count: 0,
    absent_count: 0,
    no_record_count: 0,
  });

  const COLORS = ['#4caf50', '#f44336', '#ff9800']; // Green, Red, Orange

  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await axios.get(`${apiurl}/total-information?date=${today}`);
      if (response.data) {
        setTotal(response.data);
      }
    } catch (err) {
      console.error("Error fetching total data:", err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const checkPolicyReminder = async () => {
    try {
      const response = await axios.get(`${apiurl}/expired-notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = localStorage.getItem("role");

      if (role === "admin") {
        if (response.data.result && response.data.result.length > 0) {
          setExpiringUsers(response.data.result);
          toast.success("Found users with expiring policies.");
        } else {
          toast.info("No users with expiring policies.");
        }
      } else if (role === "user") {
        if (response.data.message) {
          toast.info(response.data.message);
        } else {
          toast.warning("Your policy will expire soon. Please renew it.");
        }
      }
    } catch (err) {
      console.error("Error in fetching policy reminder:", err);
      toast.error("Failed to fetch policy reminder.");
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
      console.error("Error in fetching user data:", err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchData();
    checkPolicyReminder();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-page">
        <h3>Attendance Entries</h3>

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

        {localStorage.getItem("role") === "admin" && expiringUsers.length > 0 && (
          <div className="dashboard-box">
            <h3>Expiring Policies</h3>
            <div className="user-list">
              {expiringUsers.map((user, idx) => (
                <div key={idx}>
                  {user.name} - {user.email} - Ends: {new Date(user.enddate).toLocaleDateString()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pie Chart */}
        <div className="dashboard-chart">
          <h3>Attendance Summary</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={[
                { name: 'Present', value: total.present_count },
                { name: 'Absent', value: total.absent_count },
                { name: 'Unknown', value: total.no_record_count },
              ]}
              cx="50%"
              cy="50%"
              label
              outerRadius={100}
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

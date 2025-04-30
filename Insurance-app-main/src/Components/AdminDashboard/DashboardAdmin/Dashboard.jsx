import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { apiurl } from '../../../url';
import { toast, ToastContainer } from 'react-toastify';
import './Dashboard.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [total, setTotal] = useState({
    present_count: 0,
    absent_count: 0,
    no_record_count: 0,
  });

  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");


  const [hoveredType, setHoveredType] = useState(null);
  const [hoveredUsers, setHoveredUsers] = useState([]);
  const hoverBoxRef = useRef(null);
  const [expiringUsers, setExpiringUsers] = useState([]);

  const COLORS = ['#4caf50', '#f44336', '#ff9800'];

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
  const checkPolicyReminder = async () => {
    try {
      if (role === "user") {
        const email = localStorage.getItem("email");
        const response = await axios.get(`${apiurl}/expired-notification?email=${email}`);
        if (response.data.expired_msg) {
          toast.warning(response.data.expired_msg);
        }
        console.log("Notification Date:", response.data.notification);
      }

      if (role === "admin") {
        const response = await axios.get(`${apiurl}/admin/expired_details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.result && response.data.result.length > 0) {
          setExpiringUsers(response.data.result);
          console.log(response.data.result, "From backend")
          toast.success("Found users with expiring policies.");
        } else {
          toast.info("No users with expiring policies.");
        }
      }
    } catch (err) {
      console.error("Error fetching policy reminder:", err);
      toast.error("Failed to fetch policy reminder.");
    }
  };


  useEffect(() => {
    fetchData();
    checkPolicyReminder();
  }, []);

  const fetchHoverData = async (type) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      let response;
      if (type === 'present') {
        response = await axios.get(`${apiurl}/get-present-user?date=${today}`);
      } else if (type === 'absent') {
        response = await axios.get(`${apiurl}/get-absent-user?date=${today}`);
      } else if (type === 'unknown') {
        response = await axios.get(`${apiurl}/get-leave-user`);
      }
      setHoveredUsers(response.data || []);
      setHoveredType(type);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleLegendClick = (type) => {
    if (hoveredType === type) {
      setHoveredType(null);
      setHoveredUsers([]);
    } else {
      fetchHoverData(type);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoverBoxRef.current && !hoverBoxRef.current.contains(event.target)) {
        setHoveredType(null);
        setHoveredUsers([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderCustomLegend = () => {
    const items = [
      { name: 'Present', key: 'present', color: COLORS[0] },
      { name: 'Absent', key: 'absent', color: COLORS[1] },
      { name: 'Pending', key: 'unknown', color: COLORS[2] },
    ];

    return (
      <div className="custom-legend">
        {items.map((item, index) => (
          <div
            key={item.key}
            onClick={() => handleLegendClick(item.key)}
            className="legend-item"
          >
            {item.name}

            {hoveredType === item.key && hoveredUsers.length > 0 && (
              <div ref={hoverBoxRef} className="hovered-user-box">
                {hoveredUsers.map((user, idx) => (
                  <div key={idx} className="user-row">
                    {user.emp_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* <h3 className='text-center'>Attendance Entries</h3> */}
      <div className='row p-3'>
        <div className='col-6 attendance-summary'>

          <div className="dashboard-chart">
            <h5>Attendance Summary</h5>
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: 'Present', value: total.present_count },
                  { name: 'Absent', value: total.absent_count },
                  { name: 'Pending', value: total.no_record_count },
                ]}
                cx="50%"
                cy="50%"
                label
                outerRadius={80}
                dataKey="value"
              >
                {['present', 'absent', 'unknown'].map((type, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </div>

        </div>
        <div className='col-6 expiremsg-table'>
          
          <div className='expiretable-container'>
            <table className='expire-table'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Policy End Date</th>
                </tr>
              </thead>
              <tbody>
                {expiringUsers.map((expire, index) => {
                  return <tr>
                    <td>{expire.email}</td>
                    <td>{new Date(expire.enddate).toLocaleDateString("en-GB")}</td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer position='top-right' autoClose={3000} />
      {/* <div className="total-info-box">
                <div className="total-info-item">
                  <strong>Present:</strong> {total.present_count}
                </div>
                <div className="total-info-item">
                  <strong>Absent:</strong> {total.absent_count}
                </div>
                <div className="total-info-item">
                  <strong>Pending:</strong> {total.no_record_count}
                </div>
              </div> */}
    </div>
  );
};

export default Dashboard;



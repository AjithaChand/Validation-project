// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { apiurl } from '../../../url';
// import { toast } from 'react-toastify';
// import './Dashboard.css';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// const Dashboard = () => {
//   const token = localStorage.getItem("token");
//   const [presentUsers, setPresentUsers] = useState([]);
//   const [absentUsers, setAbsentUsers] = useState([]);
//   const [leaveUsers, setLeaveUsers] = useState([]);
//   const [visibleBox, setVisibleBox] = useState(null);
//   const [expiringUsers, setExpiringUsers] = useState([]);
//   const [total, setTotal] = useState({
//     present_count: 0,
//     absent_count: 0,
//     no_record_count: 0,
//   });

//   const COLORS = ['#4caf50', '#f44336', '#ff9800']; // Green, Red, Orange

//   const fetchData = async () => {
//     const today = new Date().toISOString().split('T')[0];
//     try {
//       const response = await axios.get(`${apiurl}/total-information?date=${today}`);
//       if (response.data) {
//         setTotal(response.data);
//       }
//     } catch (err) {
//       console.error("Error fetching total data:", err);
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   const checkPolicyReminder = async () => {
//     try {
//       const response = await axios.get(`${apiurl}/expired-notification`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const role = localStorage.getItem("role");

//       if (role === "admin") {
//         if (response.data.result && response.data.result.length > 0) {
//           setExpiringUsers(response.data.result);
//           toast.success("Found users with expiring policies.");
//         } else {
//           toast.info("No users with expiring policies.");
//         }
//       } else if (role === "user") {
//         if (response.data.message) {
//           toast.info(response.data.message);
//         } else {
//           toast.warning("Your policy will expire soon. Please renew it.");
//         }
//       }
//     } catch (err) {
//       console.error("Error in fetching policy reminder:", err);
//       toast.error("Failed to fetch policy reminder.");
//     }
//   };

//   const handleBoxClick = async (type) => {
//     const today = new Date().toISOString().split('T')[0];
//     setVisibleBox(prev => (prev === type ? null : type));

//     try {
//       let response;
//       if (type === 'present') {
//         response = await axios.get(`${apiurl}/get-present-user?date=${today}`);
//         setPresentUsers(response.data);
//       } else if (type === 'absent') {
//         response = await axios.get(`${apiurl}/get-absent-user?date=${today}`);
//         setAbsentUsers(response.data);
//       } else if (type === 'leave') {
//         response = await axios.get(`${apiurl}/get-leave-user`);
//         setLeaveUsers(response.data);
//       }
//     } catch (err) {
//       console.error("Error in fetching user data:", err);
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     checkPolicyReminder();
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-page">
//         <h3>Attendance Entries</h3>

//         <div className="dashboard-box" onClick={() => handleBoxClick('present')}>
//           <h3>Present: <span>{total.present_count}</span></h3>
//           {visibleBox === 'present' && presentUsers.length > 0 && (
//             <div className="user-list">
//               {presentUsers.map((u, i) => (
//                 <div key={i}>{u.emp_name}</div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="dashboard-box" onClick={() => handleBoxClick('absent')}>
//           <h3>Absent: <span>{total.absent_count}</span></h3>
//           {visibleBox === 'absent' && absentUsers.length > 0 && (
//             <div className="user-list">
//               {absentUsers.map((u, i) => (
//                 <div key={i}>{u.emp_name}</div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="dashboard-box" onClick={() => handleBoxClick('leave')}>
//           <h3>Unknown: <span>{total.no_record_count}</span></h3>
//           {visibleBox === 'leave' && leaveUsers.length > 0 && (
//             <div className="user-list">
//               {leaveUsers.map((u, i) => (
//                 <div key={i}>{u.emp_name}</div>
//               ))}
//             </div>
//           )}
//         </div>

//         {localStorage.getItem("role") === "admin" && expiringUsers.length > 0 && (
//           <div className="dashboard-box">
//             <h3>Expiring Policies</h3>
//             <div className="user-list">
//               {expiringUsers.map((user, idx) => (
//                 <div key={idx}>
//                   {user.name} - {user.email} - Ends: {new Date(user.enddate).toLocaleDateString()}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Pie Chart */}
//         <div className="dashboard-chart">
//           <h3>Attendance Summary</h3>
//           <PieChart width={300} height={300}>
//             <Pie
//               data={[
//                 { name: 'Present', value: total.present_count },
//                 { name: 'Absent', value: total.absent_count },
//                 { name: 'Unknown', value: total.no_record_count },
//               ]}
//               cx="50%"
//               cy="50%"
//               label
//               outerRadius={100}
//               dataKey="value"
//             >
//               {COLORS.map((color, index) => (
//                 <Cell key={`cell-${index}`} fill={color} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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
      <div className="dashboard-page">
        <h3>Attendance Entries</h3>

        {/* Summary Info Box */}
        <div className="total-info-box">
          <div className="total-info-item">
            <strong>Present:</strong> {total.present_count}
          </div>
          <div className="total-info-item">
            <strong>Absent:</strong> {total.absent_count}
          </div>
          <div className="total-info-item">
            <strong>Pending:</strong> {total.no_record_count}
          </div>
        </div>

        <div className="dashboard-chart">
          <h3>Attendance Summary</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={[
                { name: 'Present', value: total.present_count },
                { name: 'Absent', value: total.absent_count },
                { name: 'Pending', value: total.no_record_count },
              ]}
              cx="50%"
              cy="50%"
              label
              outerRadius={100}
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
        <div>

          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Policy End Date</th>
                <th>Expired</th>
              </tr>
            </thead>
            <tbody>
              {expiringUsers.map((expire, index) => {

                return <tr>
                    <td>{expire.email}</td>
                    <td>{expire.enddate}</td>
                    <td>{expire.expired_msg}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
};

export default Dashboard;




// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { apiurl } from '../../../url';
// import { toast, ToastContainer } from 'react-toastify';
// import './Dashboard.css';
// import Box from '@mui/material/Box';
// import { PieChart } from '@mui/x-charts/PieChart';

// const Dashboard = () => {
//   const [total, setTotal] = useState({
//     present_count: 0,
//     absent_count: 0,
//     no_record_count: 0,
//   });

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   const [hoveredType, setHoveredType] = useState(null);
//   const [hoveredUsers, setHoveredUsers] = useState([]);
//   const hoverBoxRef = useRef(null);
//   const [expiringUsers, setExpiringUsers] = useState([]);

//   const COLORS = ['#4caf50', '#f44336', '#ff9800'];

//   const fetchData = async () => {
//     const today = new Date().toISOString().split('T')[0];
//     try {
//       const response = await axios.get(`${apiurl}/total-information?date=${today}`);
//       if (response.data) {
//         setTotal(response.data);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   const checkPolicyReminder = async () => {
//     try {
//       if (role === "user") {
//         const email = localStorage.getItem("email");
//         const response = await axios.get(`${apiurl}/expired-notification?email=${email}`);
//         if (response.data.expired_msg) {
//           toast.warning(response.data.expired_msg);
//         }
//         console.log("Notification Date:", response.data.notification);
//       }

//       if (role === "admin") {
//         const response = await axios.get(`${apiurl}/admin/expired_details`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data.result && response.data.result.length > 0) {
//           setExpiringUsers(response.data.result);
//           console.log(response.data.result, "From backend")
//           toast.success("Found users with expiring policies.");
//         } else {
//           toast.info("No users with expiring policies.");
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching policy reminder:", err);
//       toast.error("Failed to fetch policy reminder.");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     checkPolicyReminder();
//   }, []);

//   const fetchHoverData = async (type) => {
//     const today = new Date().toISOString().split('T')[0];
//     try {
//       let response;
//       if (type === 'present') {
//         response = await axios.get(`${apiurl}/get-present-user?date=${today}`);
//       } else if (type === 'absent') {
//         response = await axios.get(`${apiurl}/get-absent-user?date=${today}`);
//       } else if (type === 'unknown') {
//         response = await axios.get(`${apiurl}/get-leave-user`);
//       }
//       setHoveredUsers(response.data || []);
//       setHoveredType(type);
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   const handleLegendClick = (type) => {
//     if (hoveredType === type) {
//       setHoveredType(null);
//       setHoveredUsers([]);
//     } else {
//       fetchHoverData(type);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (hoverBoxRef.current && !hoverBoxRef.current.contains(event.target)) {
//         setHoveredType(null);
//         setHoveredUsers([]);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const renderCustomLegend = () => {
//     const items = [
//       { name: 'Present', key: 'present', color: COLORS[0], value: total.present_count },
//       { name: 'Absent', key: 'absent', color: COLORS[1], value: total.absent_count },
//       { name: 'Pending', key: 'unknown', color: COLORS[2], value: total.no_record_count },
//     ];

//     return (
//       <div className="custom-legend">
//         {items.map((item, index) => (
//           <div
//             key={item.key}
//             onClick={() => handleLegendClick(item.key)}
//             className="legend-item"
//             style={{ color: item.color }}
//           >
//             {item.name}: {item.value}
//             {hoveredType === item.key && hoveredUsers.length > 0 && (
//               <div ref={hoverBoxRef} className="hovered-user-box">
//                 {hoveredUsers.map((user, idx) => (
//                   <div key={idx} className="user-row">
//                     {user.emp_name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const pieData = [
//     { id: 0, value: total.present_count, label: 'Present', color: COLORS[0] },
//     { id: 1, value: total.absent_count, label: 'Absent', color: COLORS[1] },
//     { id: 2, value: total.no_record_count, label: 'Pending', color: COLORS[2] },
//   ];

//   return (
//     <div className="dashboard-container">
//       <div className='row p-3'>
//         <div className='col-6 attendance-summary'>
//           <div className="dashboard-chart">
//             <h5>Attendance Summary</h5>
//             <Box sx={{ width: '100%' }}>
//               <PieChart
//                 height={300}
//                 width={400}
//                 series={[
//                   {
//                     data: pieData,
//                     innerRadius: 70, 
//                     outerRadius: 100,  
//                     paddingAngle: 3,   
//                     cornerRadius: 3, 
//                     highlightScope: { faded: 'global', highlighted: 'item' },
//                     faded: { innerRadius: 25, additionalRadius: -20, color: 'gray' },
//                   },
//                 ]}
//               />
//               {renderCustomLegend()}
//             </Box>
//           </div>
//         </div>
//         <div className='col-6 expiremsg-table'>
//           <div className='expiretable-container'>
//             <table className='expire-table'>
//               <thead>
//                 <tr>
//                   <th>Email</th>
//                   <th>Policy End Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {expiringUsers.map((expire, index) => {
//                   return <tr key={index}>
//                     <td>{expire.email}</td>
//                     <td>{new Date(expire.enddate).toLocaleDateString("en-GB")}</td>
//                   </tr>
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       <ToastContainer position='top-right' autoClose={3000} />
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { apiurl } from '../../../url';
import { toast, ToastContainer } from 'react-toastify';
import './Dashboard.css';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  // Attendance states
  const [total, setTotal] = useState({
    present_count: 0,
    absent_count: 0,
    no_record_count: 0,
  });

  // Policy calendar states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [policyData, setPolicyData] = useState([]);
  const [expiringUsers, setExpiringUsers] = useState([]);
  
  // UI states
  const [hoveredType, setHoveredType] = useState(null);
  const [hoveredUsers, setHoveredUsers] = useState([]);
  const hoverBoxRef = useRef(null);
  
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const COLORS = ['#4caf50', '#f44336', '#ff9800'];

  // Fetch attendance data
  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await axios.get(`${apiurl}/total-information?date=${today}`);
      if (response.data) setTotal(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Fetch policy count for specific date
  const fetchPolicyCount = async (date) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    try {
      const response = await axios.get(`${apiurl}/get-all-policy?date=${formattedDate}`);
      return response.data[0]?.['COUNT(*)'] || 0;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return 0;
    }
  };

  // Generate week dates
  const generateCalendarDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  // Update calendar data
  const updateCalendarData = async () => {
    const dates = generateCalendarDates();
    const counts = await Promise.all(dates.map(fetchPolicyCount));
    setPolicyData(dates.map((date, i) => ({ date, count: counts[i] })));
  };

  // Navigation handlers
  const handleDateClick = (date) => setSelectedDate(date);
  const handlePrevWeek = () => setSelectedDate(new Date(new Date(selectedDate).setDate(selectedDate.getDate() - 7)));
  const handleNextWeek = () => setSelectedDate(new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 7)));

  // Prepare chart data for ApexCharts
  const prepareChartData = () => {
    return {
      categories: policyData.map(item => 
        item.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      ),
      series: [{
        name: 'Policies',
        data: policyData.map(item => item.count)
      }]
    };
  };

  // Existing hover/legend functions
  const fetchHoverData = async (type) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      let endpoint = '';
      if (type === 'present') endpoint = '/get-present-user';
      else if (type === 'absent') endpoint = '/get-absent-user';
      else if (type === 'unknown') endpoint = '/get-leave-user';
      
      const response = await axios.get(`${apiurl}${endpoint}?date=${today}`);
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

  // Effects
  useEffect(() => {
    fetchData();
    updateCalendarData();
  }, [selectedDate]);

  const renderCustomLegend = () => {
    const items = [
      { name: 'Present', key: 'present', color: COLORS[0], value: total.present_count },
      { name: 'Absent', key: 'absent', color: COLORS[1], value: total.absent_count },
      { name: 'Pending', key: 'unknown', color: COLORS[2], value: total.no_record_count },
    ];

    return (
      <div className="custom-legend">
        {items.map((item) => (
          <div
            key={item.key}
            onClick={() => handleLegendClick(item.key)}
            className="legend-item"
            style={{ color: item.color }}
          >
            {item.name}: {item.value}
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
      <div className='row p-3'>
        {/* Left Column - Calendar & Policy Chart */}
        <div className='col-md-6'>
          {/* Policy Calendar */}
          <div className="policy-calendar-container mb-4">
            <h5>Policy Calendar</h5>
            <div className="calendar-header">
              <button className="btn btn-sm btn-outline-secondary" onClick={handlePrevWeek}>
                &lt; Prev
              </button>
              <span className="mx-2">
                {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button className="btn btn-sm btn-outline-secondary" onClick={handleNextWeek}>
                Next &gt;
              </button>
            </div>
            
            <div className="calendar-row">
              {generateCalendarDates().map((date, i) => (
                <div 
                  key={i} 
                  className={`calendar-day ${date.toDateString() === new Date().toDateString() ? 'today' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="day-number">{date.getDate()}</div>
                  <div className="policy-count">{policyData[i]?.count || 0}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="policy-chart-container">
            <h5>Policy Statistics</h5>
            {policyData.length > 0 && (
              <ReactApexChart
                options={{
                  chart: {
                    type: 'area',
                    height: 350,
                    toolbar: { show: false },
                    zoom: { enabled: false }
                  },
                  colors: [' #2196f3'],
                  dataLabels: { enabled: false },
                  stroke: { curve: 'smooth', width: 2 },
                  xaxis: {
                    categories: prepareChartData().categories,
                    labels: { style: { fontSize: '12px' } }
                  },
                  yaxis: {
                    title: { text: 'Policy Count' },
                    min: 0,
                    forceNiceScale: true
                  },
                  tooltip: {
                    y: { formatter: (val) => `${val} policies` }
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 0.9,
                      opacityFrom: 0.6,
                      opacityTo: 0,
                    }
                  }
                }}
                series={prepareChartData().series}
                type="area"
                height={250}
              />
            )}
          </div>
        </div>

        <div className='col-md-6'>
          <div className="dashboard-chart mb-4">
            <h5>Attendance Summary</h5>
            <Box sx={{ width: '100%' }}>
              <PieChart
                height={300}
                width={400}
                series={[{
                  data: [
                    { id: 0, value: total.present_count, label: 'Present', color: COLORS[0] },
                    { id: 1, value: total.absent_count, label: 'Absent', color: COLORS[1] },
                    { id: 2, value: total.no_record_count, label: 'Pending', color: COLORS[2] },
                  ],
                  innerRadius: 70,
                  outerRadius: 100,
                }]}
              />
              {renderCustomLegend()}
            </Box>
          </div>

          <div className='expiretable-container'>
            <table className='expire-table'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Policy End Date</th>
                </tr>
              </thead>
              <tbody>
                {expiringUsers.map((expire, index) => (
                  <tr key={index}>
                    <td>{expire.email}</td>
                    <td>{new Date(expire.enddate).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
};

export default Dashboard;
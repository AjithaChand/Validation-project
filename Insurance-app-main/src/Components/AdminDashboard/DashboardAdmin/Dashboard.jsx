import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { apiurl } from '../../../url';
import { toast, ToastContainer } from 'react-toastify';
import './Dashboard.css';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import ReactApexChart from 'react-apexcharts';
import HolidayCalendar from '../../CRM/Holidays';

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

  // Performance chart states
  const [performanceData, setPerformanceData] = useState({
    loading: true,
    employees: [],
    metrics: {
      completed: [],
      efficiency: [],
      overdue: []
    }
  });

  // UI states
  const [hoveredType, setHoveredType] = useState(null);
  const [hoveredUsers, setHoveredUsers] = useState([]);
  const hoverBoxRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const COLORS = ['#4caf50', '#f44336', ' #87CEEB'];

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
  // Fetch employee performance data
  const fetchPerformanceData = async () => {
    setPerformanceData(prev => ({ ...prev, loading: true }));

    try {
      const response = await axios.get(`${apiurl}/employee-performance-metrics`);
      console.log(response.data); // Log the response data
      const data = response.data;

      setTimeout(() => {
        setPerformanceData({
          loading: false,
          employees: data.map(item => item.emp_id), // Assuming you want to use emp_id for the x-axis
          metrics: {
            completed: data.map(item => item.tasks_completed),
            efficiency: data.map(item => parseFloat(item.efficiency_score)), // Convert to float
            overdue: data.map(item => item.tasks_overdue)
          }
        });
      }, 800);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setPerformanceData(prev => ({ ...prev, loading: false }));
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

  const updateCalendarData = async () => {
    const dates = generateCalendarDates();
    const counts = await Promise.all(dates.map(fetchPolicyCount));
    setPolicyData(dates.map((date, i) => ({ date, count: counts[i] })));
  };


  const handleDateClick = (date) => setSelectedDate(date);
  const handlePrevWeek = () => setSelectedDate(new Date(new Date(selectedDate).setDate(selectedDate.getDate() - 7)));
  const handleNextWeek = () => setSelectedDate(new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 7)));


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
        } else {
          toast.info("No users with expiring policies.");
        }
      }
    } catch (err) {
      console.error("Error fetching policy reminder:", err);
      toast.error("Failed to fetch policy reminder.");
    }
  };




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
    checkPolicyReminder();
    fetchPerformanceData();
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
      <div className='dashboard-column'>
        {/* Left Column - Calendar & Policy Chart */}
        <div className='col-md-6'>
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

        <div className="dashboard-chart">
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
        <div>
          <HolidayCalendar className="holiday-calender" />
        </div>

      </div>
      <div className='second-row'>
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

        {/* Employee Performance Chart */}
        <div className="performance-chart-container">
          <h5 className="chart-title">
            Employee Performance Metrics
            {performanceData.loading &&
              <span className="loading-pulse">Loading...</span>}
          </h5>

          {!performanceData.loading && performanceData.employees.length > 0 && (
            <ReactApexChart
              options={{
                chart: {
                  type: 'bar',
                  height: 350,
                  stacked: false,
                  toolbar: { show: false },
                  animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                      enabled: true,
                      delay: 150
                    },
                    dynamicAnimation: {
                      enabled: true,
                      speed: 350
                    }
                  }
                },
                colors: ['#4CAF50', '#2196F3', '#FF5722'],
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
                    dataLabels: {
                      position: 'top'
                    }
                  }
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val) => val > 0 ? val : '',
                  offsetY: -20,
                  style: {
                    fontSize: '12px',
                    colors: ['#333']
                  }
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ['transparent']
                },
                xaxis: {
                  categories: performanceData.employees,
                  labels: {
                    style: {
                      fontSize: '12px',
                      fontWeight: 600
                    },
                    rotate: -45
                  }
                },
                yaxis: {
                  title: { text: 'Performance Metrics' },
                  min: 0,
                  labels: {
                    formatter: (val) => Math.floor(val)
                  }
                },
                fill: {
                  opacity: 1,
                  gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.25,
                    opacityFrom: 0.85,
                    opacityTo: 0.85,
                    stops: [0, 100]
                  }
                },
                tooltip: {
                  y: {
                    formatter: function (val, { seriesIndex }) {
                      const types = ['Completed Tasks', 'Efficiency %', 'Overdue Tasks'];
                      return `${val} ${types[seriesIndex]}`;
                    }
                  }
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'center',
                  markers: {
                    radius: 12
                  },
                  itemMargin: {
                    horizontal: 10,
                    vertical: 5
                  }
                }
              }}
              series={[
                {
                  name: 'Completed',
                  data: performanceData.metrics.completed
                },
                {
                  name: 'Efficiency',
                  data: performanceData.metrics.efficiency
                },
                {
                  name: 'Overdue',
                  data: performanceData.metrics.overdue
                }
              ]}
              type="bar"
              height={350}
            />
          )}

        </div>
      </div>




      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
};

export default Dashboard;
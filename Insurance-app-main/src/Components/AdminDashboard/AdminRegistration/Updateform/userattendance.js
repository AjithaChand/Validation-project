import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from "../../../../url";
import axios from 'axios';
import "./userattendance.css";

const UserAttendance = () => {
  const email = localStorage.getItem("email");

  const [datas, setData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAbsent, setIsAbsent] = useState(false);
  const [reason, setReason] = useState("");
  const [hasMarked, setHasMarked] = useState(false);  
  const [offAbsent, setOffAbsent] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString();
  const monthName = currentTime.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiurl}/get-user-for-attendance/${email}`);
        if (response.data) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchData();
  }, [email]);

  const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const markAttendance = async (status) => {
    const date = getFormattedDateTime();
    
    console.log(date);
    
    try {
      const res = await axios.post(`${apiurl}/mark-attendance`, {
        email: email,
        date: date,
        status: status,
        reason: status === 0 ? reason : "",
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      toast.success(status === 1 ? "Marked as Present" : "Marked as Absent");
      setHasMarked(true);  
      setOffAbsent(false); 
  
      if (status === 0) {
        setReason("");
        setIsAbsent(false);
      }
  
      getDateForChecking();
  
    } catch (err) {
      const message = err.response?.data?.message || "Error marking attendance";
      if (err.response?.status === 400 && message === "Already Present Today") {
        toast.warning("You've already marked attendance today.");
      } else {
        toast.error(message);
      }
    }
  };
 


  const getDateForChecking = async () => {
    const today = new Date().toISOString().split('T')[0]; 
  
    try {
      const response = await axios.get(`${apiurl}/get-data-for-is-present/${email}`);
      const attendanceData = response.data;
  
      const markedToday = attendanceData?.some(item => {
        const presentTime = item.present_time;  
  
        if (!presentTime) {
          console.error("Missing present_time for item:", item);
          return false;
        }
  
        const markedDate = new Date(presentTime);
        if (isNaN(markedDate.getTime())) {
          console.error(`Invalid date: ${presentTime}`);
          return false;
        }
  
        const formattedMarkedDate = markedDate.toISOString().split('T')[0];
        return formattedMarkedDate === today;
      });
  
      if (markedToday) {
        setOffAbsent(false); 
        setHasMarked(true);   
      }
    } catch (err) {
      console.log("Error checking today's attendance:", err.message);
    }
  };
  
  useEffect(() => {
    getDateForChecking();
  }, []);

  const handleShow =()=>{
    console.log("Off absent", offAbsent);
    console.log("harsed",hasMarked);    
  }
  
  return (
    <div className='user-attendance'>
      <div className='employee-attendance'>
        <h6>Employee Id :<span>{datas[0]?.emp_id}</span></h6>

        <div className='present-time'>
          <p>{formattedTime}</p>
          <p>{formattedDate}</p>
          <p>{monthName}</p>
        </div>

      </div>

      <div className='attend-portel'>
        <h2><span className='name'>{datas[0]?.emp_name.charAt(0).toUpperCase() + datas[0]?.emp_name.slice(1).toLowerCase()}</span></h2>

        <h4>Mark Attendance</h4>
        <button
          className='attendance-present'
          onClick={() => markAttendance(1)}
          disabled={hasMarked} 
        >
          Present
        </button>
        <button
          className='attendance-absent'
          onClick={() => setIsAbsent(true)}
          disabled={hasMarked && offAbsent === false}  
        >
          Absent
        </button>
        <button onClick={handleShow}>Show </button>
      </div>

      {isAbsent && (
        <div className="reason-modal">
          <div className="reason-modal-content">
            <h4>Reason for Absence</h4>
            <input
              className='text-box'
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <button
                className="submit-reason"
                onClick={() => markAttendance(0)}
              >
                Submit
              </button>
              <button
                className="cancel-reason"
                onClick={() => {
                  setIsAbsent(false);
                  setReason("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserAttendance;

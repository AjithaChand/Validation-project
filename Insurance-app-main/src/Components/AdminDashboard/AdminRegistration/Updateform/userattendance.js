import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from "../../../../url";
import axios from 'axios';
import "./userattendance.css";

const UserAttendance = () => {
  const email = "mathav@gmail.com"
  

  const [datas, setData] = useState({
    username: "",
    id: "",
    email: ""
  });

  useEffect(() => {
    if (!email) return;

    axios.get(`http://localhost:7009/get-user-for-attendance?email=${email}`)
      .then(res => {
        if (res.data) {
          setData(res.data);
          console.log(res.data,"In user_attendance");
          
        } else {
          toast.error("User not found!");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to fetch user data.");
      })
  }, [email]);

  const getFormattedDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const time = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    return `${day}/${month}/${year} ${time}`;
  };

  const markAttendance = async (status) => {
    const date = getFormattedDateTime();

    try {
      const res = await axios.post(`${apiurl}/mark-attendance`, {
        email: datas.email,
        date: date,
        status: status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.data.success) {
        toast.success(status === 1 ? "Marked as Present" : "Marked as Absent");
      } else {
        toast.warning(res.data.message || "Already marked");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error marking attendance");
    }
  };

  return (
    <div className='user-attendance'>
      <div className='attend'>
        
          <>
            <h2>Employee Id <span>{datas.id}</span></h2>
            <h2>Employee Name <span>{datas.username}</span></h2>
            <h4>Mark Attendance:</h4>
            <button className='attendance-present' onClick={() => markAttendance(1)}>Present</button>
            <button className='attendance-absent' onClick={() => markAttendance(0)}>Absent</button>
          </>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserAttendance;

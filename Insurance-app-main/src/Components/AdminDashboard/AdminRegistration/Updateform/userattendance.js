import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from "../../../../url";
import axios from 'axios';
import "./userattendance.css";

const UserAttendance = () => {
    const email=localStorage.getItem("email")

  const [datas, setData] = useState({
    username: "",
    id: "",
    email: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    axios.get(`${apiurl}/get-user-for-attendance?id=${email}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.data) {
          setData(res.data);
        } else {
          toast.error("User not found!");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to fetch user data.");
      })
      .finally(() => setLoading(false));
  }, [email]);

  const markAttendance = async (status) => {
    const today = new Date().toISOString().split('T')[0];

    try {
      const res = await axios.post(`${apiurl}/mark-attendance`, {
        user_id: datas.id,
        date: today,
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
        {loading ? (
          <p>Loading employee info...</p>
        ) : (
          <>
            <h2>Employee Id <span>{datas.id}</span></h2>
            <h2>Employee Name <span>{datas.username}</span></h2>
            <h4>Mark Attendance:</h4>
            <button className='attendance-present' onClick={() => markAttendance(1)}>Present</button>
            <button className='attendance-absent' onClick={() => markAttendance(0)}>Absent</button>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserAttendance;

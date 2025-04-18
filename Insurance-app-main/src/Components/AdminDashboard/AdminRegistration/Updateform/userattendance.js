import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from "../../../../url";
import axios from 'axios';
import "./userattendance.css";

const UserAttendance = () => {
  const email = localStorage.getItem("email");
  

  const [datas, setData] = useState({
    emp_name: "",
    emp_id: "",
  });

  console.log();
  
  useEffect(() => {
    const fetchData= async()=>{
      try{
        
        const response = await axios.get(`${apiurl}/get-user-for-attendance/${email}`);
        if(response.data){
          setData(response.data)
          console.log(typeof response.data,"Received values");
          
        }
      }
      catch(err){
        
      }
    }
    fetchData()
  },[email])

  // const handleShow =()=>
  // {
  //   console.log(datas);
  // }


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
  
    try {
      const res = await axios.post(`${apiurl}/mark-attendance`, {
        email: email,
        date: date,
        status: status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      toast.success(status === 1 ? "Marked as Present" : "Marked as Absent");
    } catch (err) {
      console.error("Error Response:", err.response?.data);
      
      const message = err.response?.data?.message || "Error marking attendance";
      
      if (err.response?.status === 404 && message === "Already Present Today") {
        toast.warning("You've already marked attendance today.");
      } else {
        toast.error(message);
      }
    }
  };
  
  return (
    <div className='user-attendance'>
      <div className='attend'>
        
          <>
            <h2>Employee Id <span>{datas.emp_id}</span></h2>
            <h2>Employee Name <span>{datas.emp_name}</span></h2>
            <h4>Mark Attendance:</h4>
            <button className='attendance-present' onClick={() => markAttendance(1)}>Present</button>
            <button className='attendance-absent' onClick={() => markAttendance(0)}>Absent</button>
            {/* <button className='attendance-absent' onClick={handleShow}>Show</button> */}
          </>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserAttendance;

import React, { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import "./Holydays.css"; 
import { apiurl } from "../../url";

const HolydayCalendar = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`${apiurl}/get-leave`);
        setLeaveData(res.data);
        console.log("get leavesssssss", res.data);
        
      } catch (error) {
        toast.error("Failed to load leave data");
        console.error("Error fetching leave data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="leave-list-container" style={{ height:"200px", width:"200px"}}>
      <h2>Leave Records</h2>
      {loading ? (
        <p>Loading...</p>
      ) : leaveData.length === 0 ? (
        <p>No leave records found.</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
             
              <th>Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.date}</td>
                <td>{leave.leave_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HolydayCalendar;
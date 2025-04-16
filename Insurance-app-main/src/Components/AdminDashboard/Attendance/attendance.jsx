import React, { useEffect, useState } from 'react';
import "./attendance.css";
import axios from 'axios';
import { apiurl } from '../../../url';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoIosCloudUpload } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const[file,setFile]=useState(null);
   const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    axios.get(`${apiurl}/get_attendance_datas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setAttendanceData(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleDownload = () => {
    window.location.href = `${apiurl}/download-excel-for-attendance-data`;
    console.log("Download URL:", `${apiurl}/download-excel-for-attendance-data`);

  };

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${apiurl}/upload-excel-for-attendancedata`, formData);
      toast.success("File Uploaded Successfully!");
      setFile(null);
      setRefresh(prev => !prev);
    } catch (err) {
      toast.error("Upload Failed!");
    }
  };

  return (
    <div className='attendance-container'>
       <div className="admin-header-user">
                  <button className="upload-button1" onClick={handleDownload}>
                                <PiMicrosoftExcelLogoFill />
                              </button>
                  <input
                    type="file"
                    id="fileInput"
                    className="file-input"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <label htmlFor="fileInput" className="file-label">
                    <span className="text-white userslabel-name">Choose File</span>
                  </label>
                  {file && <span className="file-name">{file.name}</span>}
                  <button className="upload-button2" onClick={handleUpload}>
                    <IoIosCloudUpload />
                  </button>
                </div>
      <h1>Attendance</h1>
      <div className='attendance'>
        <table className='attend-1'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Working Days</th>
              <th>Week Off</th>
              <th>Leave Days</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((data, index) => (
              <tr key={index}>
                <td>{data.emp_name}</td>
                <td>{data.emp_email}</td>
                <td>30</td> 
                <td>4</td>  
                <td>{data.leave_days}</td>
              </tr>
            ))}
          </tbody>  
        </table>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Attendance;
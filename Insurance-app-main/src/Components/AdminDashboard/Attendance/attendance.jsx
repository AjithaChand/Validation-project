import React, { useEffect, useState } from 'react';
import "./attendance.css";
import axios from 'axios';
import { apiurl } from '../../../url';
import { IoCloudUploadOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFileExcel2Line } from "react-icons/ri";


const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [file, setFile] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [searchbar, setSearchbar] = useState("")

  const getCurrentAbsentColumn = () => {
    const now = new Date();
    const month = now.toLocaleString("default", { month: "long" }).toLowerCase(); // e.g., "april"
    const year = now.getFullYear();
    return `absent_days_${month}_${year}`;
  };

  useEffect(() => {
    axios.get(`${apiurl}/get_attendance_datas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        setAttendanceData(res.data)
        console.log("Datas in", res.data);

      })
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

  const filterdata = attendanceData.filter((values) => {
    return values.username?.toLowerCase().includes(searchbar.toLowerCase()) ||
      values.email?.toLowerCase().includes(searchbar.toLowerCase())
  })

  return (
    <div className='attendance-container'>
      <div className="admin-header-attendance">

        <p className='tablerow-attendance'>Attendance</p>

        <div className='attendance-header'>
          <button className="upload-button5" onClick={handleDownload}>
            <RiFileExcel2Line className='excel-icon-attendance' />
          </button>
          <input
            type="file"
            id="fileInput"
            className="file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="fileInput" className="file-label-attendance">
            Choose File
          </label>
          {file && <span className="file-name">{file.name}</span>}
          <button className="upload-button6" onClick={handleUpload}>
            <IoCloudUploadOutline className='upload-icon-attendance' />
          </button>
        </div>

      </div>

      <div className='admin-head-search-attendance'>

        <p className='users-count-attendance'>All Users: {filterdata.length}</p>

        <div className="searchbar-container-attendance">
          <input
            type="text"
            value={searchbar}
            placeholder="Search customer details"
            onChange={(e) => setSearchbar(e.target.value)}
            className='search-input-attendance'
          />
        </div>
      </div>

      <div className='searchbar-res-attendance mt-3'>
        <input
          type='text'
          value={searchbar}
          placeholder='Search customer details'
          onChange={(e) => setSearchbar(e.target.value)}
          className='search-input-res-attendance'
        />
      </div>

      <div className='attendance'>
        <table className='attend-1'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Working Days</th>
              <th>Week Off</th>
              <th>Absent Days</th>
            </tr>
          </thead>
          <tbody>
            {filterdata.map((data, index) => {
              const absentColumn = getCurrentAbsentColumn();
              const absentDays = data[absentColumn];

              return (
                <tr key={index}>
                  <td>{data.referal_Id}</td>
                  <td>{data.emp_name}</td>
                  <td>{data.emp_email}</td>
                  <td>30</td>
                  <td>4</td>
                  <td>{absentDays !== undefined ? absentDays : "N/A"}</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Attendance;
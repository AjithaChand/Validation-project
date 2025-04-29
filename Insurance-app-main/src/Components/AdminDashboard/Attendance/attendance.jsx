import React, { useEffect, useState } from 'react';
import "./attendance.css";
import axios from 'axios';
import { apiurl } from '../../../url';
import { IoCloudUploadOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaCheck, FaTimes } from "react-icons/fa";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const Attendance = () => {

  const [attendanceData, setAttendanceData] = useState([]);
  const [file, setFile] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [searchbar, setSearchbar] = useState("");

  const [getPermission, setGetPermission] = useState({})

  const [attendanceloading, setAttendanceloading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [calendar, setCalender] = useState(false)

  const handleClick = () => {
    setCalender(!calendar)
  }

  const person_code = localStorage.getItem("person_code")

  useEffect(() => {
    if (person_code) {
      axios.get(`${apiurl}/person-code-details?person_code=${person_code}`)

        .then(res => setGetPermission(res.data.info))

        .catch(err => console.log(err.message))
    }
  }, [person_code])


  const fetchAttendanceData = (selectedDate) => {
    const year = selectedDate.year();
    const month = String(selectedDate.month() + 1).padStart(2, '0');
    const day = String(selectedDate.date()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setAttendanceloading(true)

    axios.get(`${apiurl}/get_attendance_datas?date=${formattedDate}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.data.length === 0) {
          toast.info("No attendance data found for selected date");
          setAttendanceData([]);
        } else {
          setAttendanceData(res.data);
          console.log("Attendance dataaa", res.data);
          
        }
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.message;
        toast.error(errorMsg);
        console.error(err);
        setAttendanceData([]);
      })
      .finally(() => {
        setAttendanceloading(false)
      })
  };

  useEffect(() => {
    fetchAttendanceData(date);
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleDownload = () => {
    window.location.href = `${apiurl}/download-excel-for-attendance-data`;
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
    return values.emp_name?.toLowerCase().includes(searchbar.toLowerCase()) ||
      values.emp_email?.toLowerCase().includes(searchbar.toLowerCase())
  });

  // pagination code
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterdata.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pagenumber) => setCurrentPage(pagenumber);

  const totalPages = Math.ceil(filterdata.length / itemsPerPage);

  
  const getLocalDate = (datetime) => {
    return new Date(datetime).toLocaleDateString("en-CA"); // format: YYYY-MM-DD
  };
  
  return (
    <div className='attendance-container'>
      <div className='attendance-header-container'>
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
        <button className='calender-btn' onClick={handleClick}>Select Date</button>
        {calendar && (
          <ClickAwayListener onClickAway={() => setCalender(false)}>
            <div className="calendar">
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DateCalendar value={date} onChange={handleDateChange} />
              </LocalizationProvider>
            </div>
          </ClickAwayListener>
        )}
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

      <div className='attendance-table-container'>
        {attendanceloading ? (
          <div className='spinner'></div>
        ) : (
          <div className='attendance'>
            <table className='attend-1'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Working Days</th>
                  <th>Week Off</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              {currentItems.map((data, index) => {
  const today = new Date().toLocaleDateString("en-CA");

  const presentDate = data.present_time ? getLocalDate(data.present_time) : null;
  const absentDate = data.absent_time ? getLocalDate(data.absent_time) : null;

  const isTodayPresent = presentDate === today;
  const isTodayAbsent = absentDate === today;

  return (
    <tr key={index}>
      <td>{data.emp_id}</td>
      <td>{data.emp_name}</td>
      <td>{data.emp_email}</td>
      <td>30</td>
      <td>4</td>

      <td>
        {isTodayPresent ? (
          <FaCheck className="present-icon" />
        ) : isTodayAbsent ? (
          <span className="no-record">_</span>
        ) : (
          <span className="no-record">_</span>
        )}
      </td>

      <td>
        {isTodayAbsent ? (
          <FaTimes className="absent-icon" />
        ) : isTodayPresent ? (
          <span className="no-record">_</span>
        ) : (
          <span className="no-record">_</span>
        )}
      </td>

      <td>
        {isTodayPresent
          ? "Present"
          : isTodayAbsent
          ? "Absent"
          : "No Record"}
      </td>
    </tr>
  );
})}


              </tbody>
            </table>
            {attendanceloading === false && filterdata.length === 0 && (
              <h6 className='attendance-msg'> No User Found</h6>
            )}
          </div>
        )}
      </div>

      <div className='pagination-attendance'>
        <button
          onClick={() => { handlePageChange(currentPage - 1) }}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {currentPage > 3 && (
          <button onClick={() => handlePageChange(1)}>
            1
          </button>
        )}

        {currentPage > 4 && <span>...</span>}

        {[...Array(5)].map((_, index) => {
          const pageNum = currentPage - 2 + index;
          if (pageNum > 0 && pageNum <= totalPages) {
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={currentPage === pageNum ? "active" : ""}
              >
                {pageNum}
              </button>
            );
          }
          return null;
        })}

        {currentPage < totalPages - 3 && <span>...</span>}

        {currentPage < totalPages - 2 && (
          <button onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Attendance;
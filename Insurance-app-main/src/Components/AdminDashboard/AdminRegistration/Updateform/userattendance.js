
// import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { apiurl } from "../../../../url";
// import axios from 'axios';
// import "./userattendance.css";

// const UserAttendance = () => {
//   const email = localStorage.getItem("email");
//   const name = localStorage.getItem("username");

//   const [userLocation, setUserLocation] = useState(null);
// const [locationError, setLocationError] = useState(null);
// const officeLocation = {
//   latitude: 13.0243239,
//   longitude: 80.239788
// };

//   const [datas, setData] = useState([]);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [isAbsent, setIsAbsent] = useState(false);
//   const [reason, setReason] = useState("");
//   const [hasMarked, setHasMarked] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formattedTime = currentTime.toLocaleTimeString();
//   const formattedDate = currentTime.toLocaleDateString();
//   const monthName = currentTime.toLocaleString('default', { month: 'long' });


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${apiurl}/get-user-for-attendance/${email}`);
//         if (response.data) {
//           setData(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//       }
//     };
//     fetchData();
//   }, [email]);

//   const getFormattedDateTime = () => {
//     const now = new Date();
//     return now.toISOString().slice(0, 19).replace('T', ' ');
//   };

//   // Disable the buttons;
//   const [attendanceStatus, setAttendanceStatus] = useState(null); // 'present' or 'absent'

//   const fetchUserAttendanceStatus = async () => {
//     try {
//       const response = await axios.get(`${apiurl}/get-user-is/${email}`);
//       if (response.data) {
//         const userData = response.data[0];
//         setData([userData]);

//         const today = new Date().toISOString().slice(0, 10);
//         const presentMarked = userData.present_time?.slice(0, 10) === today;
//         const absentMarked = userData.absent_time?.slice(0, 10) === today;

//         if (presentMarked) {
//           setHasMarked(true);
//           setAttendanceStatus('present');
//         } else if (absentMarked) {
//           setHasMarked(true);
//           setAttendanceStatus('absent');
//         } else {
//           setHasMarked(false);
//           setAttendanceStatus(null);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceStatus();
//   }, [email]);


//   // Present Code

// const markAttendance = async (status) => {
//   const date = getFormattedDateTime();

//   setHasMarked(true);
//   setAttendanceStatus('present');

//   try {
//     const res = await axios.post(`${apiurl}/mark-attendance`, {
//       email,
//       date,
//       status,
//       reason: status === 0 ? reason : "",
//     }, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       }
//     });

//     if (res.data?.message === "Attendance Marked") {
//       toast.success("Successfully marked as Present today");
//     }

//     if (status === 0) {
//       setReason("");
//       setIsAbsent(false);
//     }
//   } catch (err) {
//     setHasMarked(false);
//     setAttendanceStatus(null);

//     const message = err.response?.data?.message || "Error marking attendance";
//     if (err.response?.status === 404 && message === "Already Present Today") {
//       toast.warning("You've already marked attendance as present today.");
//     } else if (err.response?.status === 404 && message === "Already Applied Leave") {
//       toast.warning("You've already applied for leave today.");
//     } else {
//       toast.error(message);
//     }
//   }
// };

// // Absent Code
// const markAbsent = async (status) => {
//   const date = getFormattedDateTime();

//   setHasMarked(true);
//   setAttendanceStatus('absent');
//   setIsAbsent(false); 

//   try {
//     const response = await axios.post(`${apiurl}/attendance-absent`, {
//       email,
//       content: reason,
//       name,
//       date,
//       status,
//     }, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       }
//     });

//     if (response.data?.message === "Leave Applied") {
//       toast.success("Leave application submitted successfully");
//     }

//     setReason("");
//   } catch (err) {
//     setHasMarked(false);
//     setAttendanceStatus(null);
//     setIsAbsent(true); 

//     const message = err.response?.data?.message || "Error sending leave request";
//     if (err.response?.status === 404 && message === "Already Applied Leave") {
//       toast.warning("You've already applied for leave today.");
//     } else if (err.response?.status === 404 && message === "Already Present Today") {
//       toast.warning("You've already marked present today.");
//     } else {
//       toast.error(message);
//     }
//   }
// };

// useEffect(() => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       console.log("Latitude:", latitude);
//       console.log("Longitude:", longitude);
//     }, (error) => {
//       console.error("Error getting location:", error);
//     });
//   } else {
//     console.log("Geolocation is not supported by this browser.");
//   }
// }, []);

//   return (
//     <div className='user-attendance'>
//       <div className='employee-attendance'>
//         <h6>Employee Id : <span>{datas[0]?.emp_id}</span></h6>
//         <div className='present-time'>
//           <p>{formattedTime}</p>
//           <p>{formattedDate}</p>
//           <p>{monthName}</p>
//         </div>
//       </div>

//       <div className='attend-portel'>
//   <h2>
//     <span className='name'>
//       {datas[0]?.emp_name.charAt(0).toUpperCase() + datas[0]?.emp_name.slice(1).toLowerCase()}
//     </span>
//   </h2>
//   <h4>Mark Attendance</h4>

//   {hasMarked ? (
//     <div className="attendance-message">
//       {attendanceStatus === 'present' ? (
//         <p className="already-marked">You've already marked yourself as present today</p>
//       ) : (
//         <p className="already-marked">You've already applied for leave today</p>
//       )}
//     </div>
//   ) : (
//     <>
//       <button
//         className='attendance-present'
//         onClick={() => markAttendance(1)}
//         disabled={hasMarked}
//       >
//         Present
//       </button>
//       <button
//         className='attendance-absent'
//         onClick={() => setIsAbsent(true)}
//         disabled={hasMarked}
//       >
//         Absent
//       </button>
//     </>
//   )}
// </div>

//       {isAbsent && (
//         <div className="reason-modal">
//           <div className="reason-modal-content">
//             <h4>Reason for Absence</h4>
//             <input
//               className='text-box'
//               type="text"
//               placeholder="Enter reason"
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//             />
//             <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
//               <button className="submit-reason" onClick={() => markAbsent(1)}>Submit</button>
//               <button className="cancel-reason" onClick={() => {
//                 setIsAbsent(false);
//                 setReason("");
//               }}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default UserAttendance;


import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from "../../../../url";
import axios from 'axios';
import "./userattendance.css";

const UserAttendance = () => {
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("username");
  const [locationName, setLocationName] = useState("");

  const [datas, setData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAbsent, setIsAbsent] = useState(false);
  const [reason, setReason] = useState("");
  const [hasMarked, setHasMarked] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Office coordinates (replace with your actual office location)
  // const officeLocation = {
  //   latitude: 13.0312612, 
  //   longitude: 80.2393794
  // };


  
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
          console.log(response.data, "User Data with left join");
          console.log(response.data[0].branch_name, "User Data with left join");
          
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchData();
    getUserLocation();
  }, [email]);

  const getFormattedDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      if (data && data.display_name) {
        setLocationName(data.display_name);
      } else {
        setLocationName("Unknown location");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setLocationName("Location lookup failed");
    }
  };


  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setUserLocation({ latitude: lat, longitude: lon });
          reverseGeocode(lat, lon);
        },
        (error) => {
          setLocationError(error.message);
          toast.error(`Location access denied: ${error.message}`);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported by your browser");
    }
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const checkLocation = () => {
    if (!userLocation) {
      toast.error("Please enable location services to mark attendance");
      return false;
    }
  
    const officeLat = datas[0]?.latitude;
    const officeLon = datas[0]?.longitude;
  
    if (!officeLat || !officeLon) {
      toast.error("Office location data not available");
      return false;
    }
  
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      officeLat,
      officeLon
    );
  
    console.log("Distance to office:", distance);
  
    if (distance > 100) {
      toast.error("You must be within 100 meters of the office to mark attendance");
      return false;
    }
  
    return true;
  };
  
  const fetchUserAttendanceStatus = async () => {
    try {
      const response = await axios.get(`${apiurl}/get-user-is/${email}`);
      if (response.data) {
        const userData = response.data[0];
        // setData([userData]);


        const today = new Date().toISOString().slice(0, 10);
        const presentMarked = userData.present_time?.slice(0, 10) === today;
        const absentMarked = userData.absent_time?.slice(0, 10) === today;

        if (presentMarked) {
          setHasMarked(true);
          setAttendanceStatus('present');
        } else if (absentMarked) {
          setHasMarked(true);
          setAttendanceStatus('absent');
        } else {
          setHasMarked(false);
          setAttendanceStatus(null);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchUserAttendanceStatus();
  }, [email]);

  const markAttendance = async (status) => {
    if (!checkLocation()) return;

    const date = getFormattedDateTime();
    setHasMarked(true);
    setAttendanceStatus('present');

    try {
      const res = await axios.post(`${apiurl}/mark-attendance`, {
        email,
        date,
        status,
        reason: status === 0 ? reason : "",
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      toast.success("Successfully marked as Present today");
    } catch (err) {
      setHasMarked(false);
      setAttendanceStatus(null);

      const message = err.response?.data?.message || "Error marking attendance";
      if (err.response?.status === 404 && message === "Already Present Today") {
        toast.warning("You've already marked present today.");
      } else {
        toast.error(message);
      }
    }
  };

  const markAbsent = async (status) => {
    if (!checkLocation()) return;

    const date = getFormattedDateTime();
    setHasMarked(true);
    setAttendanceStatus('absent');
    setIsAbsent(false);
    setReason("");

    try {
      await axios.post(`${apiurl}/attendance-absent`, {
        email,
        content: reason,
        name,
        date,
        status,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      toast.success("Leave application submitted successfully");
    } catch (err) {
      setHasMarked(false);
      setAttendanceStatus(null);
      setIsAbsent(true);

      const message = err.response?.data?.message || "Error sending leave request";
      if (err.response?.status === 404 && message === "Already Applied Leave") {
        toast.warning("You've already applied for leave today.");
      } else {
        toast.error(message);
      }
    }
  };

  // const handleShow = () =>{
  //   console.log(datas,"I am show function ");
  //   console.log(datas[0]?.latitude,"I am show function but alone");
    
  // }

  return (
    <div className='user-attendance'>
      <div className='employee-attendance'>
        <h6>Employee Id : <span>{datas[0]?.emp_id}</span></h6>
        <div className='present-time'>
          <p>{formattedTime}</p>
          <p>{formattedDate}</p>
          <p>{monthName}</p>
        </div>
      </div>

      <div className='attend-portel'>
        <h2>
          <span className='name'>
            {datas[0]?.emp_name.charAt(0).toUpperCase() + datas[0]?.emp_name.slice(1).toLowerCase()}
          </span>
        </h2>
        <h5>Branch : {datas[0]?.branch_name} & Station : {datas[0]?.station_name}</h5>
        <h4>Mark Attendance</h4>

        {userLocation && (
          <>
            <p className="location-status">
              Your coordinates: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
            </p>
            <p className="location-name"> <b>Current location:</b> {locationName}</p>
          </>
        )}

        {locationError && (
          <p className="location-error">{locationError}</p>
        )}

        {hasMarked ? (
          <div className="attendance-message">
            {attendanceStatus === 'present' ? (
              <p className="already-marked">You've marked yourself as present today</p>
            ) : (
              <p className="already-marked">You've applied for leave today</p>
            )}
          </div>
        ) : (
          <div className='attendance-entry'>
            <button
              className='attendance-present'
              onClick={() => markAttendance(1)}
            >
              Present
            </button>
            <button
              className='attendance-absent'
              onClick={() => setIsAbsent(true)}
            >
              Absent
            </button>
          </div>
        )}
                   
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
              <button className="submit-reason" onClick={() => markAbsent(1)}>Submit</button>
              <button className="cancel-reason" onClick={() => {
                setIsAbsent(false);
                setReason("");
              }}>
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
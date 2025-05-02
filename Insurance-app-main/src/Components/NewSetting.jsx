import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../url";
import './Setting.css';
import { UserContext } from "../usecontext";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import ClickAwayListener from '@mui/material/ClickAwayListener';


function CompanyDetailsForm() {
  const { setRefreshSetting } = useContext(UserContext);
  const user = localStorage.getItem("role");
  const person_code = localStorage.getItem("person_code");

  const [getPermission, setGetPermission] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [leaveType, setLeaveType] = useState("");
  const [existingLogo, setExistingLogo] = useState(null);
  const [existingSign, setExistingSign] = useState(null);
    const [calendar, setCalender] = useState(false)
    const [date, setDate] = useState(dayjs());

  const holidayList = ["2025-05-01", "2025-12-25"];

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    address: "",
    logo: null,
    sign: null,
  });

  useEffect(() => {
    if (person_code) {
      axios
        .get(`${apiurl}/person-code-details?person_code=${person_code}`)
        .then((res) => setGetPermission(res.data.info))
        .catch((err) => console.log(err.message));
    }
  }, [person_code]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/company-details`);
        const data = res.data;
        setFormData((prev) => ({
          ...prev,
          companyName: data.company_name,
          phone: data.phone,
          email: data.email,
          address: data.address,
        }));
        setExistingLogo(data.logo_url);
        setExistingSign(data.sign_url);
      } catch (err) {
        console.error("Error fetching company details:", err);
        toast.error("Failed to load company data");
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };

  const handleClick = () => {
    setCalender(!calendar)
  }

  const handleDateSubmit = async () => {
    const formattedDate = date.format('YYYY-MM-DD'); // Convert dayjs object to string
    
    if (!formattedDate || !leaveType) {
      alert("Please select a date and enter a leave type.");
      return;
    }
    
  
    const isHoliday = holidayList.includes(formattedDate);
  
    if (isHoliday) {
      toast.info(`${formattedDate} is already a holiday.`);
    } else {
      try {
        const res = await axios.post(`${apiurl}/post-leave`, {
          date: formattedDate,
          type: leaveType,
        });
        console.log("Server response:", res.data);
        toast.success(res.data.message || "Leave date added successfully!");
        } catch (error) {
        toast.error("Failed to add leave date.");
      }
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { phone, companyName, email, address, logo, sign } = formData;
    if (!phone || !companyName || !email || !address || !logo || !sign) {
      toast.error("All fields must be filled");
      return;
    }

    const data = new FormData();
    data.append("companyName", companyName);
    data.append("phone", phone);
    data.append("email", email);
    data.append("address", address);
    data.append("logo", logo);
    data.append("sign", sign);

    try {
      const res = await axios.post(`${apiurl}/api/company-details`, data);
      if (res.status === 200) {
        toast.success("Company details saved successfully!");
        setRefreshSetting((pre) => !pre);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Failed to submit company details.");
    }
  };

  return (
    <div className="company-form-wrapper">
      <form
        className="company-details-form-container"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1>Company Details Form</h1>
        <div className="first-row">
          <div>
        <input
          className="input-text-box"
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        /></div>
         <div>
        <input
          type="text"
          className="input-text-box"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        /> </div>
        <div>
        <input
          type="email"
          name="email"
          className="input-text-box"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /></div>
        </div>
        <div className="second-row">
        <textarea
          name="address"
          placeholder="Address"
          className="input-text-box"
          value={formData.address}
          onChange={handleChange}
          required
        />

       
        <label className="upload-button">
          <input
            className="type-file"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "logo")}
          />
          Logo Upload
        </label>

       
        <label className="upload-signature">
          <input
            className="type-file"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "sign")}
          />
          Signature Upload
        </label>
        </div>

        <div className="calendar-leave-section">
        <button className='calender-btn' onClick={handleClick}>Select Date</button>
        {calendar && (
          <ClickAwayListener onClickAway={() => setCalender(false)}>
            <div className="calendar">
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DateCalendar value={date} onChange={(newDate) => setDate(newDate)} />
              </LocalizationProvider>
            </div>
          </ClickAwayListener>
        )}
        <input
            type="text"
            placeholder="Enter leave type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          />
          <button type="button" onClick={handleDateSubmit}>
            Send Leave
          </button>
        </div>

        {(user === "admin" ||
          (getPermission.length !== 0 && getPermission[6]?.can_update === 1)) && (
          <button className="save" type="submit">
            Save Details
          </button>
        )}
      </form>
    </div>
  );
}

export default CompanyDetailsForm;
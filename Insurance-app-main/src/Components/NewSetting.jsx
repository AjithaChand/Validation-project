import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../url";
import './Setting.css';
import { UserContext } from "../usecontext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CompanyDetailsForm() {
  const { setRefreshSetting } = useContext(UserContext);
  const user = localStorage.getItem("role");
  const person_code = localStorage.getItem("person_code");

  const [getPermission, setGetPermission] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [leaveType, setLeaveType] = useState("");
  const [existingLogo, setExistingLogo] = useState(null);
  const [existingSign, setExistingSign] = useState(null);

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
        console.log("Company details", data.sign_url[0]);
        
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

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };

  const handleDateSubmit = async () => {
    if (!selectedDate || !leaveType) {
      alert("Please select a date and enter a leave type.");
      return;
    }

    const isHoliday = holidayList.includes(selectedDate);

    if (isHoliday) {
      toast.info(`${selectedDate} is already a holiday.`);
    } else {
      try {
        const res = await axios.post(`${apiurl}/api/add-leave`, {
          date: selectedDate,
          type: leaveType,
        });
        toast.success("Leave date added successfully!");
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
        <input
          className="input-text-box"
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="input-text-box"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className="input-text-box"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          className="input-text-box"
          value={formData.address}
          onChange={handleChange}
          required
        />

        {existingLogo && (
          <img src={existingLogo} alt="Existing Logo" className="preview-logo" />
        )}
        <label className="upload-button">
          <input
            className="type-file"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "logo")}
          />
          Logo Upload
        </label>

        {existingSign && (
          <img src={existingSign} alt="Existing Sign" className="preview-sign" />
        )}
        <label className="upload-signature">
          <input
            className="type-file"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "sign")}
          />
          Signature Upload
        </label>

        <div className="calendar-leave-section">
          <Calendar onClickDay={handleDateClick} />
          <p>Selected Date: {selectedDate || "None"}</p>
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
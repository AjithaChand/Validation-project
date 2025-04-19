import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../url";
import './Setting.css';
import { UserContext } from "../usecontext";

function CompanyDetailsForm() {

    const {setRefreshSetting} = useContext(UserContext);

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    address: "",
    logo: null,
  });

    // const [existingLogo, setExistingLogo] = useState(null);
  
    useEffect(() => {
      const fetchCompanyDetails = async () => {
        try {
          const res = await axios.get(`${apiurl}/api/company-details`);
          const data = res.data;
          console.log(data);
          
  
          setFormData({
            companyName: data.company_name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            logo: data.logo_url , 
          });
  
          // setExistingLogo(data.logo_url); 
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      logo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !formData.phone ||
      !formData.companyName ||
      !formData.email ||
      !formData.address ||
      !formData.logo
    ) {
      toast.error("All Fields Must be Required");
      return;
    }
  
    const data = new FormData();
    data.append("companyName", formData.companyName);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("logo", formData.logo);
  
    try {
      const res = await axios.post(`${apiurl}/api/company-details`, data);
  
      if (res.status === 200) {
        toast.success("Company details saved successfully!");
        setRefreshSetting(pre=>!pre)
       
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Failed to submit company details.");
    }
  };
  
  return (
  <div className="company-form-wrapper">
    <form className="company-details-form-container" onSubmit={handleSubmit} encType="multipart/form-data">
      <h1>Company Details Form</h1>
      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <input type="file" accept="image/*" onChange={handleFileChange} required/>
      {/* <img src={formData.logo} alt="" style={{ height:"30px", width:"30px"}} /> */}
      <button className="save" type="submit">Save Details</button>
    </form>
  </div>
);

}

export default CompanyDetailsForm;

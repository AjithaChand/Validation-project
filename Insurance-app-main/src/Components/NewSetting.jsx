import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../url";
import "./Setting.css";
import { UserContext } from "../usecontext";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";


function CompanyDetailsForm() {
  const { setRefreshSetting } = useContext(UserContext);
  const user = localStorage.getItem("role");
  const person_code = localStorage.getItem("person_code");

  const [getPermission, setGetPermission] = useState([]);
  const [files, setFiles] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const [existingSign, setExistingSign] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [signPreview, setSignPreview] = useState(null);

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    address: "",
    logo: null,
    sign: null,
  });

  // Fetch permissions and company details
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
    const files = e.target.files[0];
    if (!files) return;

    if (!files.type.startsWith("image/")) {
      toast.error("Only image filess are allowed!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [type]: files,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") {
        setLogoPreview(reader.result);
      } else if (type === "sign") {
        setSignPreview(reader.result);
      }
    };
    reader.readAsDataURL(files);
  };

 const HandleFileDownload=()=>
 {
  window.location.href=`${apiurl}/download-excel-for-leave`;
 };
 const handleFileUpload = async () => {
  if (!files) return toast.error("Select the file first!");

  console.log("Starting upload...");
  const formData = new FormData();
  formData.append("file", files);

  try {
    const res = await axios.post(`${apiurl}/upload-excel-for-leave`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", res.data);
    toast.success(res.data.message || "File uploaded successfully!");
    setFiles(null);
    setRefreshSetting(prev => !prev);
  } catch (err) {
    console.error("Upload failed:", err.response || err.message);
    toast.error("Upload failed!");
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

  const hasUpdatePermission =
    user === "admin" ||
    (getPermission.length > 6 && getPermission[6]?.can_update === 1);

  return (
    <div className="company-form-wrapper">
      <div className="admin-header-attendance">
       <div className="company-form">
           <div>
           <div className='attendance-header'>
                      <button className="upload-button5" onClick={HandleFileDownload}>
                        <RiFileExcel2Line className='excel-icon-attendance' />
                      </button>
                      <input
                        type="file"
                        id="fileInput"
                        className="file-input"
                        onChange={(e) => setFiles(e.target.files[0])}
                        />
                      <label htmlFor="fileInput" className="file-label-attendance">
                        Choose File
                      </label>
                      {files && <span className="file-name">{files.name}</span>}
                      <button className="upload-button6" onClick={handleFileUpload}>
                        <IoCloudUploadOutline className='upload-icon-attendance' />
                      </button>
                    </div>
          <form
            className="company-details-form-container"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="first-row">
              <div>
                <label>Company Name:</label>
                <input
                  className="input-text-box"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Mobile No:</label>
                <input
                  type="text"
                  className="input-text-box"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="input-text-box"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Address:</label>
                <textarea
                  name="address"
                  className="input-text-area"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="uploads-preview">
                {logoPreview ? (
                  <div className="preview-wrapper">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="preview-image"
                    />
                  </div>
                ) : existingLogo ? (
                  <div className="preview-wrapper">
                    <img
                      src={existingLogo}
                      alt="Logo"
                      className="preview-image"
                    />
                  </div>
                ) : null}
                {signPreview ? (
                  <div className="preview-wrapper">
                    <img
                      src={signPreview}
                      alt="Signature"
                      className="preview-image"
                    />
                  </div>
                ) : existingSign ? (
                  <div className="preview-wrapper">
                    <img
                      src={existingSign}
                      alt="Signature"
                      className="preview-image"
                    />
                  </div>
                ) : null}
              </div>

              <div className="uploads">
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
                    className="type-sign"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "sign")}
                  />
                  Signature Upload
                </label>
              </div>

              {hasUpdatePermission && (
                <button className="save" type="submit">
                  Save Details
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CompanyDetailsForm;

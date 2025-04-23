
import React, { useState, useEffect, useRef, useContext } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import image from "./sign.jpg";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaFilePdf, FaBackward } from "react-icons/fa";
import { IoMdCall, IoMdMailUnread } from "react-icons/io";
import { UserContext } from '../../../usecontext';

const Payslip = () => {

    const {refreshSetting} = useContext(UserContext);
  
  const [employeedata, setEmployeedata] = useState([]);
  const [dates, setDates] = useState("");
  const [datesTo, setDatesTo] = useState("");
  const [showBackIcon, setShowBackIcon] = useState(false);
  const [showPaySlip, setShowPaySlip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); 
  const payslipRefs = useRef([]);

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

            setFormData({
                companyName: data.company_name,
                phone: data.phone,
                email: data.email,
                address: data.address,
                logo: data.logo_url,
            });
        } catch (err) {
            console.error("Error fetching company details:", err);
            toast.error("Failed to load company data");
        }
    };

    fetchCompanyDetails();
}, [refreshSetting]);

useEffect(() => {
  if (!dates) return;

  const monthNumber = new Date(`${dates}-01`).getMonth() + 1;
  const year = new Date(`${dates}-01`).getFullYear();

  let url = `${apiurl}/get-all-employee-datas?month=${monthNumber}&year=${year}`;

  if (datesTo) {
    const monthNumberTO = new Date(`${datesTo}-01`).getMonth() + 1;
    const yearTo = new Date(`${datesTo}-01`).getFullYear();

    // Validate that the 'datesTo' month is not before the 'dates' month
    if (yearTo < year || (yearTo === year && monthNumberTO < monthNumber)) {
      toast.error("To month should not be before From month.");
      return;
    }

    url += `&monthTo=${monthNumberTO}&yearTo=${yearTo}`;
  }

  axios
    .get(url)
    .then((res) => {
      if (Array.isArray(res.data.results)) {
        setEmployeedata(res.data.results);
        setShowBackIcon(true);
        setShowPaySlip(false);
      } else {
        toast.error("Invalid response structure");
      }
    })
    .catch(() => toast.error("Error fetching employee data"));

}, [dates, datesTo]);


const disableCurrentMonth = () => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-based month (0 = January, 11 = December)
  const currentYear = today.getFullYear();

  // Get the last day of the previous month
  const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0);
  const maxDate = `${lastDayOfPreviousMonth.getFullYear()}-${(lastDayOfPreviousMonth.getMonth() + 1).toString().padStart(2, '0')}`;

  return maxDate; // Restrict to the last day of the previous month
};

// Fix for generating payslips: Avoid current month
const isBeforeCurrentMonth = (date) => {
  const today = new Date();
  const selectedDate = new Date(date);
  return (
    selectedDate.getFullYear() < today.getFullYear() ||
    (selectedDate.getFullYear() === today.getFullYear() && selectedDate.getMonth() < today.getMonth())
  );
};

const generateAllPDFs = async () => {
  // Check if the selected dates are valid and before the current month
  if (!isBeforeCurrentMonth(dates) || !isBeforeCurrentMonth(datesTo)) {
    toast.error("Cannot generate payslips for the current or future months.");
    return;
  }

  setLoading(true);
  setProgress(0);
  toast.info("Generating ZIPs, please wait...");

  if (!employeedata.length) {
    toast.error("No employee data found");
    setLoading(false);
    return;
  }

  const groupedByMonth = {};

  employeedata.forEach((emp, index) => {
    const date = new Date(emp.salary_date || emp.dates || dates);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month.toString().padStart(2, "0")}`;

    if (!groupedByMonth[key]) {
      groupedByMonth[key] = [];
    }
    groupedByMonth[key].push({ emp, index });
  });

  const keys = Object.keys(groupedByMonth);

  let currentProgress = 0;

  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    const zip = new JSZip();
    const employees = groupedByMonth[key];

    for (let i = 0; i < employees.length; i++) {
      const { emp, index } = employees[i];
      const element = payslipRefs.current[index];
      if (!element) continue;

      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output("blob");

        zip.file(`Payslip_${emp.emp_id}.pdf`, pdfBlob);

        currentProgress = Math.round(((k * employees.length + i + 1) / (keys.length * employees.length)) * 100);
        setProgress(currentProgress);
      } catch (err) {
        console.error(`Error generating PDF for ${emp.emp_id}`, err);
      }
    }

    const [year, month] = key.split("-");
    await zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `payslips_${year}_${month}.zip`);
    });
  }

  toast.success("All monthly ZIPs downloaded!");
  setLoading(false);
};


return (
  <div className="payslip-design-1">
    {loading && (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p style={{ color: "white" }}>Generating payslips ZIP... Please wait</p>
        <div className="progress-bar">
          <div
            className="progress-bar-filled"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p style={{ color: "white" }}>{progress}%</p>
      </div>
    )}

    <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center" }}>
      <div className="payslip-file">
        <h1 className="portal">Payslip Portal</h1>
      </div>
      <div className='field-content'>
        {showBackIcon && (
          <FaBackward
            className="pageback-icon"
            onClick={() => {
              setDates("");
              setEmployeedata([]);
              setShowBackIcon(false);
              setShowPaySlip(false);
            }}
          />
        )}
        <div className="payslip-field">
          <div className="input-fields">
            <label>From Month</label>
            <input
              type="month"
              className="payslipinput"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              max={disableCurrentMonth()} // Apply the max restriction to the From Month input
            />
          </div>

          <div className="input-fields">
            <label>To Month</label>
            <input
              type="month"
              className="payslipinput"
              value={datesTo}
              onChange={(e) => setDatesTo(e.target.value)}
              max={disableCurrentMonth()} // Apply the max restriction to the To Month input
            />
          </div>
        </div>
      </div>
      {employeedata.length > 0 && !showPaySlip && (
        <div className="pdf-button-download">
          <button className="pdfbutton" onClick={() => setShowPaySlip(true)}>
            <FaFilePdf className="pdf-icon" /> Show Payslips
          </button>
        </div>
      )}

      {showPaySlip && (
        <>
          <div className="pdf-button-download">
            <button className="pdfbutton" onClick={generateAllPDFs}>
              <FaFilePdf className="pdf-icon" /> Generate ZIP with PDFs
            </button>
          </div>

          {showPaySlip && (
            <div className='payslip-container'>
              <div className="payslip_data">
                <table className="payslip-1">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Username</th>
                      <th>Working Days</th>
                      <th>Week Off</th>
                      <th>Leave Days</th>
                      <th>Bank Details</th>
                      <th>PF Amount</th>
                      <th>ESI Amount</th>
                      <th>Gross Salary</th>
                      <th>Net Salary</th>
                      <th>Revised Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeedata.map((employee, index) => (
                      <tr key={index}>
                        <td>{employee.referal_Id}</td>
                        <td>{employee.emp_name}</td>
                        <td>30</td>
                        <td>4</td>
                        <td>{employee.leave_days}</td>
                        <td>{employee.bank_details}</td>
                        <td>{employee.pf_amount}</td>
                        <td>{employee.esi_amount}</td>
                        <td>{employee.gross_salary}</td>
                        <td>{employee.net_amount}</td>
                        <td>{employee.revised_salary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {employeedata.map((employee, index) => (
            <div className="heading-payslip" key={index}>
              <div
                className="payslip-style"
                ref={(el) => (payslipRefs.current[index] = el)}
              >
                <div className="design"></div>
                <div className="company-header">
                  <img className="image-logo" src={formData.logo} alt="Company Logo" />
                  <div className="company">
                    <h3>Payslip</h3>
                    <p className="contact-line">
                      <IoMdCall className="icon" /> {formData.phone} &nbsp;
                      <IoMdMailUnread className="icon" /> {formData.email}
                    </p>
                  </div>
                  <div className="address">
                    <h6>{formData.companyName}</h6>
                    <p>
                      {formData.address}
                    </p>
                    <p>Date: {new Date().toLocaleDateString("en-GB")}</p>
                  </div>
                </div>

                <div className="gap"></div>

                <div className="info-sections">
                  <div className="info-column">
                    <h4>Employee Details</h4>
                    <ul>
                      <li>Employee ID: <span>{employee.emp_id}</span></li>
                      <li>Name: <span>{employee.emp_name || "N/A"}</span></li>
                      <li>Bank Details: <span>{employee.bank_details}</span></li>
                      <li>Date of Joining: <span>{ new Date(employee.joining_date).toISOString("").split("T")[0]}</span></li>
                    </ul>
                  </div>

                  <div className="info-column">
                    <h4>Attendance Info</h4>
                    <ul>
                      <li>Attendance: <span>26 Days</span></li>
                      <li>Week Off: <span>4 Days</span></li>
                      <li>Leave Days: <span>{employee.leave_days || 0}</span></li>
                    </ul>
                  </div>
                </div>

                <div className="bottom-section">
                  <div className="info-column">
                    <h4>Deductions</h4>
                    <ul>
                      <li>PF: <span>{employee.pf_amount || 0}</span></li>
                      <li>ESI: <span>{employee.esi_amount || 0}</span></li>
                      <li>Gross Salary: <span>{employee.gross_salary || 0}</span></li>
                      <li>Net Salary: <span>{employee.net_amount || 0}</span></li>
                      <li>Revised Salary: <span>{employee.revised_salary}</span></li>
                    </ul>
                  </div>

                  <div className="signature-box">
                    <img className="image-sign" src={image} alt="Sign" />
                    <p>Authorized signature</p>
                  </div>
                </div>

                <div className="bottom-design"></div>
              </div>
            </div>
          ))}
        </>
      )}

</div>

      <ToastContainer />
    </div>
  );
};

export default Payslip;
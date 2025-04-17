import React, { useState, useEffect, useRef } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import img from "./nastaflogo.jpg";
import image from "./sign.jpg";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaFilePdf, FaBackward } from "react-icons/fa";
import { IoMdCall, IoMdMailUnread } from "react-icons/io";

const Payslip = () => {
  const [employeedata, setEmployeedata] = useState([]);
  const [dates, setDates] = useState("");
  const [datesTo, setDatesTo] = useState("");
  const [showBackIcon, setShowBackIcon] = useState(false);
  const [showPaySlip, setShowPaySlip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); 
  const payslipRefs = useRef([]);

  useEffect(() => {
    if (!dates) return;
  
    const monthNumber = new Date(`${dates}-01`).getMonth() + 1;
    const year = new Date(`${dates}-01`).getFullYear();
  
    let url = `${apiurl}/get-all-employee-datas?month=${monthNumber}&year=${year}`;
  
    console.log("From url",url);
    
    if (datesTo) {
      const monthNumberTO = new Date(`${datesTo}-01`).getMonth() + 1;
      const yearTo = new Date(`${datesTo}-01`).getFullYear();
      url += `&monthTo=${monthNumberTO}&yearTo=${yearTo}`;
      console.log("TO url", url);

    }
    
    axios
      .get(url)
      .then((res) => {
        if (Array.isArray(res.data.results)) {
          setEmployeedata(res.data.results);
          console.log(res.data.results);
          
          setShowBackIcon(true);
          setShowPaySlip(false);
        } else {
          toast.error("Invalid response structure");
        }
      })
      .catch(() => toast.error("Error fetching employee data"));
  
  }, [dates, datesTo]);
  
  useEffect(() => {
    if (showPaySlip) {
      payslipRefs.current = [];
    }
  }, [showPaySlip]);

  // const generateAllPDFs = async () => {
  //   setLoading(true);
  //   setProgress(0);
  //   toast.info("Generating ZIPs, please wait...");
  
  //   if (!employeedata.length) {
  //     toast.error("No employee data found");
  //     setLoading(false);
  //     return;
  //   }
  
  //   const groupedByMonth = {};
  
  //   employeedata.forEach((emp, index) => {
  //     const date = new Date(emp.salary_date || emp.dates || dates); 
  //     const month = date.getMonth() + 1;
  //     const year = date.getFullYear();
  //     const key = `${year}-${month.toString().padStart(2, "0")}`;
  
  //     if (!groupedByMonth[key]) {
  //       groupedByMonth[key] = [];
  //     }
  //     groupedByMonth[key].push({ emp, index });
  //   });
  
  //   const keys = Object.keys(groupedByMonth);
  
  //   for (let k = 0; k < keys.length; k++) {
  //     const key = keys[k];
  //     const zip = new JSZip();
  //     const employees = groupedByMonth[key];
  
  //     for (let i = 0; i < employees.length; i++) {
  //       const { emp, index } = employees[i];
  //       const element = payslipRefs.current[index];
  //       if (!element) continue;
  
  //       try {
  //         const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  //         const imgData = canvas.toDataURL("image/png");
  
  //         const pdf = new jsPDF("p", "mm", "a4");
  //         const pdfWidth = pdf.internal.pageSize.getWidth();
  //         const imgProps = pdf.getImageProperties(imgData);
  //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  //         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //         const pdfBlob = pdf.output("blob");
  
  //         zip.file(`Payslip_${emp.emp_id}.pdf`, pdfBlob);
  //         setProgress(Math.round(((k + 1) / keys.length) * 100));
  //       } catch (err) {
  //         console.error(`Error generating PDF for ${emp.emp_id}`, err);
  //       }
  //     }
  
  //     const [year, month] = key.split("-");
  //     await zip.generateAsync({ type: "blob" }).then((content) => {
  //       saveAs(content, `payslips_${year}_${month}.zip`);
  //     });
  //   }
  
  //   toast.success("All monthly ZIPs downloaded!");
  //   setLoading(false);
  // };
  
  const generateAllPDFs = async () => {
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
  
    let currentProgress = 0; // Track the progress manually
  
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
  
          // Update progress after processing each PDF
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
    <div className="payslip-design">
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

      <div className="payslip-file">
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
        <h1 className="portal">Payslip Portal</h1>
      </div>

      <div className="payslip-field">
        <div className="input-fields">
          <label>From Month</label>
          <input
            type="month"
            className="payslipinput"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
          />
        </div>

        <div className="input-fields">
          <label>To Month</label>
          <input
            type="month"
            className="payslipinput"
            value={datesTo}
            onChange={(e) => setDatesTo(e.target.value)}
          />
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
                  <img className="image-logo" src={img} alt="Company Logo" />
                  <div className="company">
                    <h3>Payslip</h3>
                    <p className="contact-line">
                      <IoMdCall className="icon" /> 075502 56616 &nbsp;
                      <IoMdMailUnread className="icon" /> info@nastaf.com
                    </p>
                  </div>
                  <div className="address">
                    <h6>Nastaf Technologies LLP</h6>
                    <p>
                      II Floor, Swathi Complex, No.34,<br />
                      Flat No 2, Nandanam, Chennai,<br />
                      Tamil Nadu 6000017
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
                      <li>Bank Details: <span>XXXX-XXXX-1234</span></li>
                      <li>Date of Joining: <span>{employee.dates || "N/A"}</span></li>
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

      <ToastContainer />
    </div>
  );
};

export default Payslip;
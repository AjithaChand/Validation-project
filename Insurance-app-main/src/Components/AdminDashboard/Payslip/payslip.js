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
  const [showBackIcon, setShowBackIcon] = useState(false);
  const [showPaySlip, setShowPaySlip] = useState(false);
  const [loading, setLoading] = useState(false);
  const payslipRefs = useRef([]);

  useEffect(() => {
    if (!dates) return;

    const monthNumber = new Date(`${dates}-01`).getMonth() + 1;
    const year = new Date(`${dates}-01`).getFullYear();

    axios
      .get(`${apiurl}/get-all-employee-datas?month=${monthNumber}&year=${year}`)
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
  }, [dates]);

  useEffect(() => {
    if (showPaySlip) {
      payslipRefs.current = []; // Reset refs when showing slips
    }
  }, [showPaySlip]);

  const generateAllPDFs = async () => {
    setLoading(true); // Start loader
    toast.info("Generating ZIP, please wait...");

    if (!employeedata.length) {
      toast.error("No employee data found");
      setLoading(false);
      return;
    }

    const zip = new JSZip();

    for (let i = 0; i < employeedata.length; i++) {
      const employee = employeedata[i];
      const element = payslipRefs.current[i];

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

        zip.file(`Payslip_${employee.emp_id}.pdf`, pdfBlob);
      } catch (err) {
        console.error(`Error generating PDF for ${employee.emp_id}`, err);
      }
    }

    zip.generateAsync({ type: "blob" })
      .then((content) => {
        saveAs(content, "payslips.zip");
        toast.success("Payslips ZIP downloaded!");
      })
      .catch((err) => {
        console.error("ZIP creation failed", err);
        toast.error("Failed to create ZIP");
      })
      .finally(() => {
        setLoading(false); // Stop loader
      });
  };

  return (
    <div className="payslip-design">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{color:"white"}}>Generating payslips ZIP... Please wait</p>
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
          <label>Month</label>
          <input
            type="month"
            className="payslipinput"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
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
                      <li>Revised Salary: <span>₹47,000</span></li>
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

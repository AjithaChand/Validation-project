import React, { useState } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";

const PayslipUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPayslip, setShowPayslip] = useState(false);
  const [payslipvalue, setPayslipvalue] = useState({});
  
  const handlePayslipget = async () => {
    if (!name || !email) {
      toast.error("All fields are required!!");
      return;
    }

    const data = { name, email };

    try {
      const response = await axios.post(`${apiurl}/admin_post_salary`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(response.data.message);
      setShowPayslip(true);

      // Fetch latest payslip to show
      fetchPayslipData(email);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error or server is unreachable");
      }
    }
  };

  const fetchPayslipData = async (email) => {
    try {
      const response = await axios.get(`${apiurl}/get-user-payslip/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = Array.isArray(response.data) ? response.data[0] : response.data.result || {};
      setPayslipvalue(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setPayslipvalue({});
    }
  };

  const fetchAndDownloadPayslip = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email for payslip");
      return;
    }
    try {
      const response = await axios.get(`${apiurl}/get-user-payslip/${email}`);
      const data = Array.isArray(response.data) ? response.data[0] : response.data.result;

      if (data) {
        generatePDF(data);
      } else {
        toast.error("There is no payslip for this email");
      }
    } catch (error) {
      console.error("Failed to fetch payslip", error);
      toast.error("Failed to fetch payslip");
    }
  };

  const generatePDF = (payslipData) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("Payslip", 90, 20);
    pdf.setFontSize(12);

    let yPosition = 40;

    Object.keys(payslipData).forEach((key) => {
      pdf.text(`${key.replace("_", " ")}: ${payslipData[key]}`, 20, yPosition);
      yPosition += 10;
    });

    pdf.save(`Payslip_${email}.pdf`);
  };

  return (
    <div className='payslip-design'>
      <h1 className='portal'>Payslip Portal</h1>

      {!showPayslip && (
        <div className='payslip-field'>
          <div className='input-fields'>
            <label>Name</label>
            <input
              type='text'
              className='payslipinput'
              placeholder='Enter Your Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='input-fields'>
            <label>Email</label>
            <input
              className='payslipinput'
              type='email'
              placeholder='Enter Your Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="payslip-button" onClick={handlePayslipget}>Submit</button>
        </div>
      )}

      <button onClick={fetchAndDownloadPayslip}>
        Download Payslip
      </button>

      {showPayslip && payslipvalue && (
        <div className='heading-payslip'>
          <div className='company-header'>
            <img className='image' src="logo.jpg" alt="Company Logo" />
            <h3>Nastaf Technologies LLP</h3>
          </div>
          <p className='text-center'>
            Payslip for the month of {new Date().toLocaleString('default', { month: 'long' })}
          </p>

          <div className='employee-details'>
            <h5>Employee Name: {name}</h5>
            <h5 className='pf-number'>PF No: {payslipvalue.pf_number || "N/A"}</h5>
          </div>

          <h4>Earnings</h4>
          <ul>
            <li>ESI: <span>{payslipvalue.esi_amount}</span></li>
            <li>PF: <span>{payslipvalue.pf_amount}</span></li>
            <li>Gross Salary: <span>{payslipvalue.gross_salary}</span></li>
            <li>Net Salary: <span>{payslipvalue.net_amount}</span></li>
            <li>Total Salary: <span>{payslipvalue.total_salary}</span></li>
          </ul>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PayslipUser;

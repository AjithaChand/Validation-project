import React, { useState } from 'react';
import "./payslipuser.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // For structured tables
import { FaFilePdf } from "react-icons/fa"; // PDF Icon
import autoTable from "jspdf-autotable";
import img from "./insurance.jpg"; 
import { IoMdArrowBack } from "react-icons/io";
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
  
    try {
      const response = await axios.get(`${apiurl}/get-user-payslip?email=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.data.results) {
        setPayslipvalue(response.data.results);
        setShowPayslip(true);
        toast.success("Payslip found!");
      } else {
        toast.error("No payslip found for this email.");
        setShowPayslip(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  

  const generatePDF = () => {
    
    console.log(payslipvalue);

    const pdf = new jsPDF();
    
    pdf.setFontSize(18);
    pdf.text("Nastaf Technologies LLP", 70, 15);
    pdf.setFontSize(12);
    pdf.text(`Payslip for ${new Date().toLocaleString('default', { month: 'long' })}`, 75, 25);
    pdf.line(10, 30, 200, 30); 
  
    pdf.setFontSize(14);
    pdf.text("Employee Details:", 10, 40);
    pdf.setFontSize(12);
    pdf.text(`Name: ${payslipvalue.emp_name}`, 10, 50);
    pdf.text(`Email: ${payslipvalue.emp_email}`, 10, 60);
    pdf.text(`PF Number: ${payslipvalue.pf_number}`, 10, 70);
  
    pdf.setFontSize(14);
    pdf.text("Salary Breakdown", 10, 85);
    autoTable(pdf, {
      startY: 90,
      head: [["Description", "Amount"]],
      body: [
        ["ESI", payslipvalue.esi_amount || "N/A"],
        ["PF", payslipvalue.pf_amount || "N/A"],
        ["Gross Salary", payslipvalue.gross_salary || "N/A"],
        ["Net Salary", payslipvalue.net_amount || "N/A"],
        ["Total Salary", payslipvalue.total_salary || "N/A"]
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 150, 136] }, 
    });
  
    pdf.save(`Payslip_${payslipvalue.emp_name || "employee"}.pdf`);
  
    
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

          <button className="payslip-button" onClick={handlePayslipget}>
            Submit
          </button>
        </div>
      )}

      {showPayslip && payslipvalue && (
        <div className='heading-payslip'>
            <IoMdArrowBack className='pageback-icon' 
            onClick={() => {setShowPayslip(false)
                setName('');
                setEmail('');
              }}
            />
          <div className='company-header'>
            <img className='image' src={img} alt="Company Logo" />
            <h3>Nastaf Technologies LLP</h3>
          </div>
          <p className='payslip-month'>Payslip for the month of {new Date().toLocaleString('default', { month: 'long' })}</p>

          <div className='employee-details'>
            <h5>Employee Name: {payslipvalue.emp_name}</h5>
            <h5 className='pf-number'>PF No: {payslipvalue.pf_number}</h5>
          </div>

          <h4>Earnings</h4>
          <ul>
            <li>ESI: <span>{payslipvalue.esi_amount}</span></li>
            <li>PF: <span>{payslipvalue.pf_amount}</span></li>
            <li>Gross Salary: <span>{payslipvalue.gross_salary}</span></li>
            <li>Net Salary: <span>{payslipvalue.net_amount}</span></li>
            <li>Total Salary: <span>{payslipvalue.total_salary}</span></li>
          </ul>
<div className='pdf-button-download'>
          <button className="pdfbutton" onClick={generatePDF}>
             <FaFilePdf className="pdf-icon" /> Download Payslip
          </button>
        </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PayslipUser;

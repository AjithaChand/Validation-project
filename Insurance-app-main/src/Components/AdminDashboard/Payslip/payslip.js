import React, { useState } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import img from "./insurance.jpg"; 
import { IoMdArrowBack } from "react-icons/io";

const Payslip = () => {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState(null);
  const [email, setEmail] = useState("");
  const [pf_number, setPf_Number] = useState("");
  const [showPayslip, setShowPayslip] = useState(false);
  const [getPfNumber,setgetPfNumber]=useState("");
  const[hover,setHover]=useState("upload");

  const pf_amount = salary * 0.12;
  const esi_amount = salary * 0.0075;
  const net_amount = salary - pf_amount - esi_amount;
  const gross_salary = salary;
  const total_salary = gross_salary;

 const generatePfNumber = () => {
    const prefix = "NASTAF639000";
    const lastNumber = localStorage.getItem("lastPfNumber");
    const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
    const formattedNumber = String(nextNumber).padStart(3, "0");
    const pf = `${prefix}${formattedNumber}`;
    localStorage.setItem("lastPfNumber", nextNumber);
    return pf;
  };

  const handleupdatepayslip = async () => {
  
    if (!name || !email || !salary) {
      toast.error("All fields are required!!");
      return;
    }
  
    const data = {
      pf_amount,
      esi_amount,
      net_amount,
      gross_salary,
      total_salary,
      email
    };
  
    try {
      const response = await axios.put(`${apiurl}/admin-edit-salary`, data, {
        headers: {
          "Content-Type": "application/json",Authorization:`Bearer ${localStorage.getItem("token")}`
        },
      });
  
      toast.success(response.data.message); 
      setgetPfNumber(response.data.pf_number)
      setShowPayslip(true);
console.log("showPayslip will be set to true now.");

    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error or server is unreachable");
      }
    }
 
  };
  


  const handlePayslipUpload = async () => {
 
    if (!name || !email || !salary) {
      toast.error("All fields are required!!");
      return;
    }
  
    const pfNum = generatePfNumber(); 
    setPf_Number(pfNum);   

    const data = {
      name,
      email,
      pf_number: pfNum,
      pf_amount,
      esi_amount,
      net_amount,
      gross_salary,
      total_salary
    };
  
    try {
      const response = await axios.post(`${apiurl}/admin-post-salary`, data, {
        headers: {
          "Content-Type": "application/json",Authorization:`Bearer ${localStorage.getItem("token")}`
        },
      });
  
      toast.success(response.data.message); 
      setPf_Number(pfNum);
      setShowPayslip(true);
      console.log("PF Number Generated:", pfNum);
console.log("showPayslip will be set to true now.");

    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error or server is unreachable");
      }
    }
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
          <div className='input-fields'>
            <label>Salary</label>
            <input
              className='payslipinput'
              type='number'
              placeholder='Enter Amount'
              value={salary || ""}
              onChange={(e) => setSalary(Number(e.target.value))}
            />
            <div className='button-for-payslip'>
  <button className="payslip-button" onClick={handlePayslipUpload}>Upload</button>
  <button className='payslip-button' onClick={handleupdatepayslip}>Update</button>

</div>


          </div>
         
        </div>
     )} 
  {showPayslip && (
        <div className='heading-payslip'>
            <IoMdArrowBack className='pageback-icon' 
            onClick={() =>{ setShowPayslip(false)
              setName('');
              setEmail('');
              setSalary('');
            }}
         />
          <div className='company-header'>
            <img className='image' src={img} alt="Company Logo" />
            <h3>Nastaf Technologies LLP</h3>
          </div>
          <p className='payslip-month'>Payslip for the month of {new Date().toLocaleString('default', { month: 'long' })}</p>

          <div className='employee-details'>
            <h5>Employee Name: {name}</h5>
            <h5 className='pf-number'>PF No: {getPfNumber ? getPfNumber : pf_number}</h5>
          </div>
          <h4>Earnings</h4>
          <ul>
            <li>ESI <span>{esi_amount.toFixed(2)}</span></li>
            <li>PF <span>{pf_amount.toFixed(2)}</span></li>
            <li>Gross Salary <span>{gross_salary}</span></li>
            <li>Net Salary <span>{net_amount.toFixed(2)}</span></li>
            <li>Total Salary <span>{total_salary}</span></li>
          </ul>
        </div>
     )}
  
      <ToastContainer />
    </div>
  );
  
};

export default Payslip;
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../../../url";
import "./Payslipdialog.css"
const PayslipDialog = ({ onClose, onUploadSuccess,generatePDF }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
   const generatePfNumber = () => {
    const prefix = "NASTAF639000";
    const lastNumber = localStorage.getItem("lastPfNumber");
    const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
    const formattedNumber = String(nextNumber).padStart(3, "0");
    const pf = `${prefix}${formattedNumber}`;
    localStorage.setItem("lastPfNumber", nextNumber);
    return pf;
  };

  const handleSubmit = async () => {
    if (!name || !email || !salary) {
      toast.error("All fields are required!");
      return;
    }
  
    const pfNum = generatePfNumber();
    const pfAmount = (salary * 0.12).toFixed(2);
    const esiAmount = (salary * 0.0075).toFixed(2);
    const netAmount = (salary - pfAmount - esiAmount).toFixed(2);
  
    const data = {
      name,
      email,
      pf_number: pfNum,
      pf_amount: pfAmount,
      esi_amount: esiAmount,
      net_amount: netAmount,
      gross_salary: salary,
      total_salary: salary,
    };
  
    try {
      const response = await axios.post(`${apiurl}/admin-post-salary`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      toast.success(response.data.message);
  
      // Trigger success handler
      onUploadSuccess(data, pfNum);
  
     
  
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload New Payslip</h2>
        <input
          type="text"
          placeholder="Name"
          className="payslipinput"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="payslipinput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Salary"
          className="payslipinput"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
        />
        <div className="modal-buttons">
          <button className="payslip-button" onClick={handleSubmit}>submit</button>
          <button className="payslip-button cancel" onClick={onClose}>Cancel</button>
        
        </div>
      </div>
    </div>
  );
};

export default PayslipDialog;

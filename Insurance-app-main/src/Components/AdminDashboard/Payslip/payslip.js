import React, { useState, useEffect } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import img from "./insurance.jpg";
import { IoMdArrowBack } from "react-icons/io";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

import PayslipDialog from './payslipdialog';

const Payslip = () => {
  const [usernames, setUsernames] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [pfAmount, setPfAmount] = useState("");
  const [esiAmount, setEsiAmount] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [totalSalary, setTotalSalary] = useState("");
  const [pfNumber, setPfNumber] = useState("");
  const [showPayslip, setShowPayslip] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const[showinput,setShowinput]=useState(true)

  useEffect(() => {
    axios.get(`${apiurl}/get-all-employee-names`)
      .then(res => {
        if (Array.isArray(res.data.results)) {
          setUsernames(res.data.results.map(user => user.username));
        }
      })
      .catch(() => toast.error("Error fetching employee names"));
  }, []);

  const handleUserSelect = async (selectedName) => {
    setName(selectedName);
    if (!selectedName) return;

    try {
      const res = await axios.get(`${apiurl}/get-single-employee-data?name=${selectedName}`);
      const data = res.data.results;

      if (data) {
        const salaryVal = parseFloat(data.total_salary || 0);
        const pf = (salaryVal * 0.12).toFixed(2);
        const esi = (salaryVal * 0.0075).toFixed(2);
        const net = (salaryVal - pf - esi).toFixed(2);

        setEmail(data.emp_email || "");
        setSalary(salaryVal);
        setTotalSalary(salaryVal);
        setPfAmount(pf);
        setEsiAmount(esi);
        setNetAmount(net);
        setPfNumber(data.pf_number || "");
        setShowFields(true);
      }
    } catch {
      toast.error("Failed to fetch employee details");
    }
  };

  const handleUpdatePayslip = async () => {
    const data = {
      pf_amount: pfAmount,
      esi_amount: esiAmount,
      net_amount: netAmount,
      gross_salary: salary,
      total_salary: salary,
      email,
      name
    };

    try {
      const res = await axios.put(`${apiurl}/admin-edit-salary`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success(res.data.message);
      setPfNumber(res.data.pf_number || pfNumber);
      setShowPayslip(true);
      setShowFields(false);
      setShowinput(false)
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Nastaf Technologies LLP", 70, 15);
    doc.text(`Payslip for ${new Date().toLocaleString('default', { month: 'long' })}`, 75, 25);
    autoTable(doc, {
      startY: 40,
      head: [["Description", "Amount"]],
      body: [
        ["ESI", esiAmount],
        ["PF", pfAmount],
        ["Gross Salary", salary],
        ["Net Salary", netAmount],
        ["Total Salary", totalSalary]
      ]
    });
    doc.save(`Payslip_${name}.pdf`);
    toast.success("PDF downloaded");
  };

  const handleUploadSuccess = (data, pfNum) => {
    setName(data.name);
    setEmail(data.email);
    setSalary(data.gross_salary);
    setPfAmount(data.pf_amount);
    setEsiAmount(data.esi_amount);
    setNetAmount(data.net_amount);
    setTotalSalary(data.total_salary);
    setPfNumber(pfNum);
    setShowPayslip(true);
    setShowForm(false);
    setShowinput(true)
  };

  return (
    <div className="payslip-design">
      <h1 className="portal">Payslip Portal</h1>
      <button 
  onClick={() => {
    setShowForm(true); 
    setShowinput(false);
  }}
>
  + New Payslip
</button>



      {showinput && (
        <div className="payslip-field">
          <div className="input-fields">
            <label>Name</label>
            <select className="payslipinput" value={name} onChange={(e) => handleUserSelect(e.target.value)}>
              <option value="">Select Employee</option>
              {usernames.map((u, i) => (
                <option key={i} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {showFields && (
            <>
              <div className="input-fields"><label>Email</label><input value={email} readOnly /></div>
              <div className="input-fields">
  <label>Total Salary</label>
  <input 
    type="number" 
    className="inputfields" 
    value={totalSalary}  
    onChange={(e) => {
      const newSalary = parseFloat(e.target.value) || 0;
      setTotalSalary(newSalary);
      setSalary(newSalary); // Update salary too
      const pf = (newSalary * 0.12).toFixed(2);
      const esi = (newSalary * 0.0075).toFixed(2);
      const net = (newSalary - pf - esi).toFixed(2);
      setPfAmount(pf);
      setEsiAmount(esi);
      setNetAmount(net);
    }} 
  />
</div>

              <div className="input-fields"><label>PF Amount</label><input value={pfAmount} readOnly /></div>
              <div className="input-fields"><label>ESI Amount</label><input value={esiAmount} readOnly /></div>
              <div className="input-fields"><label>Net Amount</label><input value={netAmount} readOnly /></div>
              <button className="payslip-button" onClick={handleUpdatePayslip}>Update</button>
            </>
          )}
        </div>
      )}

      {showPayslip && (
        <div className="heading-payslip">
          <IoMdArrowBack className="pageback-icon" onClick={() => setShowPayslip(false)} />
          <div className="company-header">
            <img className="image" src={img} alt="Company Logo" />
            <h3>Nastaf Technologies LLP</h3>
          </div>
          <p className="payslip-month">Payslip for {new Date().toLocaleString('default', { month: 'long' })}</p>
          <div className="employee-details">
            <h5>Employee Name: {name}</h5>
            <h5>PF No: {pfNumber}</h5>
          </div>
          <ul>
            <li>ESI <span>{esiAmount}</span></li>
            <li>PF <span>{pfAmount}</span></li>
            <li>Gross Salary <span>{salary}</span></li>
            <li>Net Salary <span>{netAmount}</span></li>
            <li>Total Salary <span>{totalSalary}</span></li>
          </ul>
          <button className="pdfbutton" onClick={generatePDF}>
            <FaFilePdf className="pdf-icon" /> Download Payslip
          </button>
        </div>
      )}

      {showForm && (
        <PayslipDialog
        onClose={() => setShowForm(false)}
        onUploadSuccess={handleUploadSuccess}
        generatePDF={({ name, salary, pfAmount, esiAmount, netAmount, totalSalary }) => {
          const doc = new jsPDF();
          const today = new Date();
          doc.text("Nastaf Technologies LLP", 70, 15);
          doc.text(`Payslip for ${today.toLocaleString('default', { month: 'long' })}`, 70, 25);
          doc.text(`Date: ${today.toLocaleDateString()}`, 15, 35);
          autoTable(doc, {
            startY: 50,
            head: [["Description", "Amount"]],
            body: [
              ["ESI", esiAmount],
              ["PF", pfAmount],
              ["Gross Salary", salary],
              ["Net Salary", netAmount],
              ["Total Salary", totalSalary]
            ]
          });
          doc.save(`Payslip_${name.replace(/\s+/g, "_")}_${today.toLocaleDateString()}.pdf`);
          toast.success("PDF downloaded");
        }}
      />
      
      )}

      <ToastContainer />
    </div>
  );
};

export default Payslip;

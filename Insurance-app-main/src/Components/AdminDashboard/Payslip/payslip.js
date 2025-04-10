import React, { useState, useEffect } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import img from "./insurance.jpg";
import { IoMdArrowBack } from "react-icons/io";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

const Payslip = () => {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [pf_number, setPf_Number] = useState("");
  const [showPayslip, setShowPayslip] = useState(false);
  const [getPfNumber, setgetPfNumber] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [showFields, setShowFields] = useState(false);

  const [totalSalary, setTotalSalary] = useState("");
  const [pfAmount, setPfAmount] = useState("");
  const [esiAmount, setEsiAmount] = useState("");
  const [netAmount, setNetAmount] = useState("");

  useEffect(() => {
    axios
      .get(`${apiurl}/get-all-employee-names`)
      .then((res) => {
        if (res.data.results && Array.isArray(res.data.results)) {
          setUsernames(res.data.results.map((user) => user.username));
        }
      })
      .catch(() => {
        toast.error("Failed to fetch employee names");
      });
  }, []);

  const generatePfNumber = () => {
    const prefix = "NASTAF639000";
    const lastNumber = localStorage.getItem("lastPfNumber");
    const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
    const formattedNumber = String(nextNumber).padStart(3, "0");
    const pf = `${prefix}${formattedNumber}`;
    localStorage.setItem("lastPfNumber", nextNumber);
    return pf;
  };

  const handleUserSelect = async (selectedName) => {
    setName(selectedName);
    if (!selectedName) return;

    try {
      const res = await axios.get(`${apiurl}/get-single-employee-data?name=${selectedName}`);
      const data = res.data.results;

      if (data) {
        const salaryValue = parseFloat(data.total_salary || 0);
        const pf = salaryValue * 0.12;
        const esi = salaryValue * 0.0075;
        const net = salaryValue - pf - esi;

        setEmail(data.emp_email || "");
        setSalary(salaryValue);
        setTotalSalary(salaryValue);
        setPfAmount(pf.toFixed(2));
        setEsiAmount(esi.toFixed(2));
        setNetAmount(net.toFixed(2));
        setShowFields(true);
      }
    } catch {
      toast.error("Failed to fetch employee details");
    }
  };

  const handleupdatepayslip = async () => {
    if (!name || !email || !salary) {
      toast.error("All fields are required!!");
      return;
    }

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
      const response = await axios.put(`${apiurl}/admin-edit-salary`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });

      toast.success(response.data.message);
      setgetPfNumber(response.data.pf_number);
      setShowPayslip(true);
      setShowFields(false)
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
      pf_amount: pfAmount,
      esi_amount: esiAmount,
      net_amount: netAmount,
      gross_salary: salary,
      total_salary: salary
    };

    try {
      const response = await axios.post(`${apiurl}/admin-post-salary`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });

      toast.success(response.data.message);
      setShowPayslip(true);
      setShowFields(false)

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Nastaf Technologies LLP", 70, 15);
    pdf.setFontSize(12);
    pdf.text(`Payslip for ${new Date().toLocaleString('default', { month: 'long' })}`, 75, 25);
    pdf.line(10, 30, 200, 30);

    pdf.setFontSize(14);
    pdf.text("Employee Details:", 10, 40);
    pdf.setFontSize(12);
    pdf.text(`Name: ${name}`, 10, 50);
    pdf.text(`Email: ${email}`, 10, 60);
    pdf.text(`PF Number: ${getPfNumber || pf_number}`, 10, 70);

    pdf.setFontSize(14);
    pdf.text("Salary Breakdown", 10, 85);
    autoTable(pdf, {
      startY: 90,
      head: [["Description", "Amount"]],
      body: [
        ["ESI", esiAmount],
        ["PF", pfAmount],
        ["Gross Salary", salary],
        ["Net Salary", netAmount],
        ["Total Salary", salary]
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 150, 136] },
    });

    pdf.save(`Payslip_${name || "employee"}.pdf`);
  };

  return (
    <div className='payslip-design'>
      <h1 className='portal'>Payslip Portal</h1>

      <div className="input-fields">
        <label>Name</label>
        <select
          className="payslipinput"
          value={name}
          onChange={(e) => handleUserSelect(e.target.value)}
        >
          <option value="">Select Employee</option>
          {usernames.map((username, index) => (
            <option key={index} value={username}>{username}</option>
          ))}
        </select>
      </div>

      {showFields &&  (
        <>
          <div className="input-fields">
            <label>Email</label>
            <input type="email" className="payslipinput" value={email}  />
          </div>
          <div className="input-fields">
            <label>Total Salary</label>
            <input type="number" className="payslipinput" value={totalSalary}  />
          </div>
          <div className="input-fields">
            <label>PF Amount</label>
            <input type="number" className="payslipinput" value={pfAmount}/>
          </div>
          <div className="input-fields">
            <label>ESI Amount</label>
            <input type="number" className="payslipinput" value={esiAmount}  />
          </div>
          <div className="input-fields">
            <label>Net Amount</label>
            <input type="number" className="payslipinput" value={netAmount}/>
          </div>
          <div className='button-for-payslip'>
  <button className="payslip-button" onClick={handlePayslipUpload}>Upload</button>
  <button className='payslip-button' onClick={handleupdatepayslip}>Update</button>

</div>
        </>
      )}

      {showPayslip && (
        <div className='heading-payslip'>
          <IoMdArrowBack className='pageback-icon' onClick={() => {
            setShowPayslip(false);
            setName('');
            setEmail('');
            setSalary('');
            setShowFields(false);
          }} />
          <div className='company-header'>
            <img className='image' src={img} alt="Company Logo" />
            <h3>Nastaf Technologies LLP</h3>
          </div>
          <p className='payslip-month'>Payslip for the month of {new Date().toLocaleString('default', { month: 'long' })}</p>

          <div className='employee-details'>
            <h5>Employee Name: {name}</h5>
            <h5 className='pf-number'>PF No: {getPfNumber || pf_number}</h5>
          </div>
          <h4>Earnings</h4>
          <ul>
            <li>ESI <span>{esiAmount}</span></li>
            <li>PF <span>{pfAmount}</span></li>
            <li>Gross Salary <span>{salary}</span></li>
            <li>Net Salary <span>{netAmount}</span></li>
            <li>Total Salary <span>{totalSalary}</span></li>
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

export default Payslip;
import React, { useState, useEffect, useRef } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import img from "./nastaflogo.jpg";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { FaFilePdf, FaBackward } from "react-icons/fa";
import PayslipDialog from './payslipdialog';
import { IoMdCall, IoMdMailUnread } from "react-icons/io";
import image from "./sign.jpg";

// import { IoIosAddCircle } from "react-icons/io";

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
  const [showInput, setShowInput] = useState(true);
  const [showBackIcon, setShowBackIcon] = useState(false);
  const [empId, setEmpId] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const payslipRef = useRef();
  const[employeedata,setEmployeedata]=useState([])
  const[revisedsalary,setRevisedsalary]=useState("");
   const[Leavedays,setLeavedays]=useState([])
  useEffect(() => {
    axios.get(`${apiurl}/get-all-employee-names`)
      .then(res => {
        if (Array.isArray(res.data.results)) {
          setUsernames(res.data.results.map(user => user.username));
        }
      })
      .catch(() => toast.error("Error fetching employee names"));
  }, []);

const showValue=()=>{
  console.log("Clicked ",revisedsalary);
  
}

  useEffect(() => {
    if (!name) return;
  
    axios.get(`${apiurl}/get_attendance_datas?name=${name}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => {
      const data = res.data;
      setEmployeedata(data);
      const employee = data.find(emp => emp.emp_name === name);
  
      if (employee) {
        const leave = employee.leave_days;
        const amount = parseFloat(employee.net_amount);
  
        setLeavedays(leave);
        setNetAmount(amount);
  
        console.log("netAmount:", amount, "Leavedays:", leave);
        console.log("Leave days for", name, leave);
  
        const workingDays = 30;
        const perDaySalary = amount / workingDays;
        const leavesalary = leave * perDaySalary;
        const revised = amount - leavesalary;
        setRevisedsalary(revised);
        console.log("Revised salary calculated:", revised);
      } else {
        setLeavedays(0);
        console.warn("Employee not found in attendance data");
      }
    })
    .catch(err => {
      console.error(err);
      toast.error("Error fetching attendance data");
    });
  }, [name]);
  
    
  
  
  
const handleUserSelect = async (selectedName) => {
    setName(selectedName);
    if (!selectedName) {
      toast.error("Please select a valid employee");
      return;
    }

    try {
      const res = await axios.get(`${apiurl}/get-single-employee-data?name=${selectedName}`);
      const data = res?.data?.results;

      if (data) {
        const salaryVal = parseFloat(data.total_salary);
        if (!salaryVal || salaryVal === 0) {
          setShowFields(false);
          setEmail("");
          setSalary("");
          setTotalSalary("");
          setPfAmount("");
          setEsiAmount("");
          setNetAmount("");
          return;
        }

        const pf = (salaryVal * 0.12).toFixed(2);
        const esi = (salaryVal * 0.0075).toFixed(2);
        const net = (salaryVal - pf - esi).toFixed(2);

        setEmpId(data.emp_id);
        setEmail(data.emp_email || "");
        setSalary(salaryVal);
        setTotalSalary(salaryVal);
        setPfAmount(pf);
        setEsiAmount(esi);
        setNetAmount(net);
        setPfNumber(data.pf_number || "");
        setShowFields(true);
        setShowPdf(false);
      }
    } catch {
      toast.error("The admin has not updated the salary yet.");
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
      setShowInput(false);
      setShowPdf(true);
      setShowBackIcon(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };
  const handleSubmit = async () => {
    if (!email || !revisedsalary) {
      toast.error("Both fields are required.");
      return;
    }
  
    try {
      const res = await axios.put(`${apiurl}/put_attendance_datas`, {
        email,
        revised_salary: revisedsalary
      });
  
      toast.success(res.data.message);
      setEmail('');
      setRevisedsalary('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update salary");
    }
  };
  
  const generatePDF = () => {
    const input = payslipRef.current;
    if (!input) {
      toast.error("Payslip content not available");
      return;
    }

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Payslip_${name.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF downloaded");
    }).catch(() => {
      toast.error("Failed to generate PDF");
    });
  };

  const handleUploadSuccess = (data, pfNum) => {
    setName(data.name);
    setEmail(data.email);
    setSalary(data.gross_salary);
    setPfAmount(data.pf_amount);
    setEsiAmount(data.esi_amount);
    setNetAmount(data.net_amount);
    setTotalSalary(data.total_salary);
    setEmpId(data.emp_id);
    setPfNumber(pfNum);
    setShowPayslip(true);
    setShowForm(false);
    setShowInput(false);
    setShowPdf(true);
  };

  return (
    <div className="payslip-design">
      {showBackIcon && (
        <FaBackward
          className="pageback-icon"
          aria-label="Go back"
          onClick={() => {
            setShowPayslip(false);
            setShowInput(true);
            setShowPdf(false);
            setShowFields(false);
          }}
        />
      )}

      <h1 className="portal">Payslip Portal</h1>

      {showInput && (
        <div className="payslip-field">
          <div className="input-fields">
            <label>Name</label>
            <select className="payslipinput" value={name} onChange={(e) => handleUserSelect(e.target.value)}>
              <option className='option' value="">Select Employee</option>
              {usernames.map((u, i) => (
                <option key={i} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {showFields && (
            <>
              <div className="input-fields"><label>Email</label><input className="payslipinput" value={email} readOnly /></div>
              <div className="input-fields"><label>Total salary</label><input className="payslipinput" value={totalSalary} readOnly /></div>
              <div className="input-fields"><label>PF Amount</label><input className="payslipinput" value={pfAmount} readOnly /></div>
              <div className="input-fields"><label>ESI Amount</label><input className="payslipinput" value={esiAmount} readOnly /></div>
              <div className="input-fields"><label>Net Amount</label><input className="payslipinput" value={netAmount} readOnly /></div>
              <button className="payslip-button" onClick={() => { handleSubmit(); handleUpdatePayslip(); }}>submit</button>
            
            </>
          )}
        </div>
      )}

      {showPayslip && (
        <div className="heading-payslip">
          <div className='payslip-style' ref={payslipRef}>
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
                <p>II Floor, Swathi Complex, No.34,<br />
                  Flat No 2, Nandanam, Chennai,<br />
                  Tamil Nadu 6000017</p>
                <p>Date: {new Date().toLocaleDateString('en-US')}</p>
              </div>
            </div>

            <div className="gap"></div>

            <div className="info-sections">
              <div className="info-column">
                <h4>Employee Details</h4>
                <ul>
                  <li>Employee ID: <span>{empId}</span></li>
                  <li>Name: <span>{name}</span></li>
                  <li>Bank Details: <span>XXXX-XXXX-1234</span></li>
                  <li>Date of Joining: <span>01/01/2022</span></li>
                </ul>
              </div>

              <div className="info-column">
                <h4>Attendance Info</h4>
                <ul>
                  <li>Attendance: <span>26 Days</span></li>
                  <li>Week Off: <span>4 Days</span></li>
                  <li>Leavedays :<span>{Leavedays}</span></li>
                </ul>
              </div>
            </div>

            <div className="bottom-section">
              <div className="info-column">
                <h4>Deductions</h4>
                <ul>
                  <li>PF: <span>{pfAmount}</span></li>
                  <li>ESI: <span>{esiAmount}</span></li>
                  <li>Gross Salary: <span>{salary}</span></li>
                  <li>Net Salary: <span>{netAmount}</span></li>
                  <li>Revised Salary:<span>{revisedsalary}</span></li>
                </ul>
              </div>

              <div className="signature-box">
                <img className="image-sign" src={image} alt="Authorized Sign" />
                <p>Authorized signature</p>
              </div>
            </div>

            <div className="bottom-design"></div>
          </div>
        </div>
      )}

      {showPdf && (
        <div className='pdf-button-download'>
          <button className="pdfbutton" onClick={generatePDF}>
            <FaFilePdf className="pdf-icon" /> Download Pdf
          </button>
          <button onClick={showValue}>Show the value</button>
        </div>
      )}

      {showForm && (
        <PayslipDialog
          onClose={() => {
            setShowForm(false);
            setShowInput(true);
          }}
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

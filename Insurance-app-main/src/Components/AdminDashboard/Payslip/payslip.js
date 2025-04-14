import React, { useState, useEffect } from 'react';
import "./payslip.css";
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import img from "./nastaflogo.jpg";
import { IoMdArrowBack } from "react-icons/io";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { FaFilePdf } from "react-icons/fa";
import PayslipDialog from './payslipdialog';
import { IoMdCall } from "react-icons/io";
import { IoMdMailUnread } from "react-icons/io";
import image from "./sign.jpg";
import { IoIosAddCircle } from "react-icons/io";
import { FaBackward } from "react-icons/fa";
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
  const [empId, setEmpId] = useState("");
  const payslipRef = useRef();
  const[showpdf,setShowpdf]=useState(false)
  const[showslip,setShowslip]=useState(true)
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
      
          setShowFields(false); // hide the fields
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
        setShowpdf(false);
        setShowslip(true);
      }
    } catch {
      // toast.error("Failed to fetch employee details");
      toast.error("Salary is not updated by the admin");
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
      setShowpdf(true)
      setShowslip(false)
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
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
    setShowinput(false)
    setShowpdf(true)
    setShowslip(false)
  };

  return (
    <div className="payslip-design">
     <FaBackward className="pageback-icon"
           onClick={() => {setShowPayslip(false);
               setShowinput(true);
               setShowpdf(false);
               setShowslip(true)
               setShowFields(false)
           } }/>
           {showslip&&(
        <IoIosAddCircle 
  className='add-payslip' 
  onClick={() => {
    setShowForm(true);  
    setShowinput(false); 
    setShowslip(false);    
  }}
/> 
           )}

            <h1 className="portal">Payslip Portal</h1>
      {showinput && (
        <div className="payslip-field">
          <div className="input-fields">
            <label>Name</label>
            <select   className="payslipinput"value={name} onChange={(e) => handleUserSelect(e.target.value)}>
              <option className='option' value="">Select Employee</option>
              {usernames.map((u, i) => (
                <option key={i} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {showFields && (
            <>
              <div className="input-fields" ><label>Email</label><input className="payslipinput" value={email} readOnly /></div>
              <div className="input-fields">
  <label>Total Salary</label>
  <input 
    type="number" 
   className="payslipinput"
    value={totalSalary}  
    onChange={(e) => {
      const newSalary = parseFloat(e.target.value) || null;
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
           
              <div className="input-fields"><label>PF Amount</label><input  className="payslipinput" value={pfAmount} readOnly /></div>
              <div className="input-fields"><label>ESI Amount</label><input   className="payslipinput"value={esiAmount} readOnly /></div>
              <div className="input-fields"><label>Net Amount</label><input   className="payslipinput"value={netAmount} readOnly /></div>
             <button className="payslip-button" onClick={handleUpdatePayslip}>Update</button>
            </>
          )}
        </div>
      )}

      {showPayslip && (
         <div className="heading-payslip">
         <div className='payslip-style' ref={payslipRef}>
          <div className='design'></div>
  <div className="company-header" onClick={()=>setShowpdf(true)}>
    <img className="image-logo" src={img} alt="Company Logo" />
    <div className='company'>
      <h3 >Payslip</h3>
      <p className="contact-line">
        <IoMdCall className="icon" /> 075502 56616 &nbsp;
        <IoMdMailUnread className="icon" /> info@nastaf.com
      </p>
    </div>
    <div className='address'>
      <h6>Nastaf Technologies LLP</h6>
      <p>II Floor, Swathi Complex, No.34,<br />Flat No 2, Nandanam, Chennai,<br />Tamil Nadu 6000017</p>
      <p>Date : {new Date().toLocaleDateString('en-US')}</p>
    </div>
  </div>

  <div className='gap'></div>

  <ul>
    <li>Employee Id <span>{empId}</span></li>
    <li>Name<span>{name}</span></li>
    <li>ESI <span>{esiAmount}</span></li>
    <li>PF <span>{pfAmount}</span></li>
    <li>Basic Salary <span>{totalSalary}</span></li>
  </ul>

  <div className='signature'>
    <div className='sign-1'>
    <img className="image-sign" src={image} alt="Authorized Sign" />
    <p>Authorized signature</p>
    </div>
  </div>
  <div className='bottom-design'></div>
</div>

</div>
      )}
     {showpdf&&(
      <div className='pdf-button-download'>
      <button className="pdfbutton" onClick={generatePDF}>
            <FaFilePdf className="pdf-icon" />Download Pdf
          </button>
          </div>
     )}
     
      {showForm && (
        <PayslipDialog
        onClose={() => {setShowForm(false);
          setShowinput(true);
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

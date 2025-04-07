import React, { useState } from 'react'
import "./payslip.css"
import { apiurl } from '../../../url';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const Payslip = () => {
    const[name,setName]=useState("")
    const[salary,setSalary]=useState(null);
    const[email,setEmail]=useState("");
    const basicpay=parseFloat(salary);
    const Pf=basicpay*0.12;
    const Esi=basicpay*0.0075;
    const Netsalary=basicpay-Pf-Esi;
    const Grosssalary=basicpay;
    const Totalsalary=Netsalary;

    const handlePayslipUpload = async () => {
        if(!name||!email||!salary)
        {
            toast.error("All fields are requied!!")
            return;
        }
        const formData = new FormData();
        formData.append("name",name);
        formData.append("email",email)
        formData.append("basicpay", basicpay);
        formData.append("pf",Pf);
        formData.append("Esi",Esi);
        formData.append("netsalary",Netsalary);
        formData.append("grosssalary",Grosssalary);
        formData.append("totalsalary",Totalsalary)
    
        try {
          await axios.post(`${apiurl}/admin-post-salary`, formData);
          toast.success("data uploaded Successfully!");
        } catch (err) {
          toast.error(" upload Failed!");
        }
    
      }
     return (
    <div className='payslip-design'>
         <div>
            <h1 className='portal'>Payslip Portel </h1>
         </div>
         <div className='payslipfield'>
            <label>Name</label>
         <input
        type='text'
         className='payslipinput'
        placeholder='Enter Your Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
         />
       <label>Email</label>
       <input
        className='payslipinput'
       type='email'
      placeholder='Enter Your Email'
      value={email}
      onChange={(e) => setEmail(e.target.value)}
/>
     <label>Salary</label>
     <input
     className='payslipinput'
     type='number'
     placeholder='Enter Amount'
     value={salary}
     onChange={(e) => setSalary(e.target.value)}
/>
<button  className="payslip-button"onClick={handlePayslipUpload}>Submit</button>
         </div>
     <div className='company-header'>
          <h3>company logo</h3>
        <h4>company name</h4>
      </div>
      
      <p>payslip for the month of April </p>
      <div className='employee-details'>
      <h3>Employee Name :{name}</h3>
      <h2>PF No :</h2>
       </div>
       <h2>Earnings</h2>
       <ul>
        <li>ESI <span>{Esi}</span></li>
        <li>PF<span>{Pf}</span></li>
        <li>Gross Salary<span>{Grosssalary}</span></li>
        <li>Net Salary<span>{Netsalary}</span></li>
        <li>Total Salary<span>{Totalsalary}</span></li>
       </ul>
       <ToastContainer/>
    </div>
  )
}

export default Payslip

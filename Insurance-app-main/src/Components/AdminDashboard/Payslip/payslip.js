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
    const [showPayslip, setShowPayslip] = useState(false); 
    // const[pfnumber,setPfnumber]=useState(0);
    const pf_amount=salary*0.12;
    const esi_amount=salary*0.0075;
    const net_amount=salary-pf_amount-esi_amount;
    const gross_salary=salary;
    const total_salary=gross_salary;

    const handlePayslipUpload = async () => {
        if(!name||!email||!salary)
        {
            toast.error("All fields are requied!!")
            return;
        }
        const formData = new FormData();
        formData.append("name",name);
        formData.append("email",email)
        formData.append("salary", salary);
        formData.append("pf",pf_amount);
        formData.append("Esi",esi_amount);
        formData.append("netsalary",net_amount);
        formData.append("grosssalary",gross_salary);
        formData.append("totalsalary",total_salary)
    
        try {
          await axios.post(`${apiurl}/admin_post_salary`, formData);
          toast.success("data uploaded Successfully!");
          setShowPayslip(true);
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
         {showPayslip&&(
     <div className='heading -payslip'>
     <div className='company-header'>
     <img className='image' src="logo.svg" alt="" />
     <h3>Nastaf Technologies LLP</h3>
      </div>
      <p className='text-center'>payslip for the month of April </p>
      <div className='employee-details'>
      <h3>Employee Name :{name}</h3>
      <h2>PF No :</h2>
       </div>
       <h2>Earnings</h2>
       <ul>
        <li>ESI <span>{esi_amount}</span></li>
        <li>PF<span>{pf_amount}</span></li>
        <li>Gross Salary<span>{gross_salary}</span></li>
        <li>Net Salary<span>{net_amount}</span></li>
        <li>Total Salary<span>{total_salary}</span></li>
       </ul>
       <ToastContainer/>
       </div>
         )}
    </div>
  )
}

export default Payslip

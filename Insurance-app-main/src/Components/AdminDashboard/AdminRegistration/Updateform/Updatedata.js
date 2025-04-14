import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import '../Updateform/Updatedata.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../../url';
import '../Updateform/Updatedata.css';
import { UserContext } from '../../../../usecontext';

const Updatedata = ( {selectid , close, selectemail} ) => {

  const [refresh,setRefresh] = useState(false)

  const {setUpdateOldUser} = useContext(UserContext)


  const [datas,setData] = useState({
    username:"",
    email:"",
    password:"",
    total_salary:""
  })




  const handleSalarychange = (e) => {
    const value = e.target.value;
  
    if (value === "") {
      setData(prev => ({
        ...prev,
        total_salary: "",
        pf_amount: "",
        esi_amount: "",
        net_amount: "",
        gross_salary: ""
      }));
      return;
    }
  
    const salary = parseFloat(value);
    if (isNaN(salary)) return;
  
    const pf = (salary * 0.12).toFixed(2);
    const esi = (salary * 0.0075).toFixed(2);
    const net = (salary - pf - esi).toFixed(2);
    const gross_salary = salary;
  
    setData(prev => ({
      ...prev,
      total_salary: salary,
      pf_amount: pf,
      esi_amount: esi,
      net_amount: net,
      gross_salary
    }));
  };
    

  useEffect(()=>{

    if(!selectemail) return;

    axios.get(`${apiurl}/getuser/single?email=${selectemail}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res=>{
      if(res.data){
        setData(res.data)
      }else{
        toast.error("User not found!")
      }
    })
    .catch(err=>console.log(err))
  },[selectemail,refresh])

const handleSubmit = (e) =>{

  console.log("For Update submit",datas);
  
    e.preventDefault();
    axios.put(`${apiurl}/edituser/${selectid}`,datas,{
      headers:{
         Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res=>{
      toast.success(res.data.message)
      setUpdateOldUser(pre=>!pre)
      close()
      setRefresh(!refresh)
    })
    .catch(err=>toast.error(err.response.data.error))



    axios.post(`${apiurl}/password_changed`,{
      email: datas.email,
      password: datas.password
    })
    .then((res)=>{
      if(res.data.success){
        toast.success(`Send Email To ${datas.email}`)        
      }
    })
    .catch((err)=>{
      console.log(err.message);
    })

  }

  return (
    <div >
      <form onSubmit={handleSubmit} className='update-form' >
        <h3 className='text-center updatehead mt-2'>Update Data</h3>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Username</label>
          <input className='form-control' type='text' value={datas.username} onChange={e=>setData({...datas,username:e.target.value})} placeholder='Enter your username' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Email</label>
          <input type='email' className='form-control' value={datas.email} onChange={e=>setData({...datas,email:e.target.value})} placeholder='Enter your email' readOnly/>
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Password</label>
          <input type='password' className='form-control' value={datas.password} onChange={e=>setData({...datas,password:e.target.value})} placeholder='Enter your password' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Salary</label>
          <input
  type='number'
  className='form-control'
  value={datas.total_salary}
  onChange={handleSalarychange}
  placeholder='Enter your salary'
/>

        </div>
        <button className='btn userupdate-btn mt-4' style={{backgroundColor:"#333"}}>Submit</button>
      </form>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Updatedata
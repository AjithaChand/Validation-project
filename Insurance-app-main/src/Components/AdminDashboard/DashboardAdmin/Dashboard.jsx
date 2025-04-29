import React, { useState } from 'react'
import axios from 'axios';
import { apiurl } from '../../../url';
import { toast } from 'react-toastify';

const Dashboard = () => {
  
  const [total, setTotal] = useState([]);

  const now = new Date();
  const date = new Date(now).toISOString("").split("T")[0];

const fetchData = async()=>{
   try{
    const response  = await axios.get(`${apiurl}/total-information?date=${date}`)

    if(response.data){
      setTotal(response.data)
    }
  } 
  catch(err){
    toast(err.message)
  }

}

  return (
    <div>
      
    </div>
  )
}

export default Dashboard

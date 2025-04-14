import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiurl } from '../../url'

const Permission = () => {

  const [usernames,setUsernames] = useState([])
  

  useEffect(()=>{
    axios.get(`${apiurl}/get-all-username`)

    .then(res=>setUsernames(res.data))

    .catch(err=>console.error("Error fetching username", err))

  },[])

  console.log(usernames);
const setHandler =(data)=>{
  alert(data)
}
  return (
    <div>
        <h2>Permission For Users</h2>
    
    {usernames.map((user, index)=>(
      <div key={index}>
        <h5><button onClick={()=>setHandler(user.username)}>{user.username}</button></h5>
        </div>
    ))}
 
    </div>
  )
}

export default Permission
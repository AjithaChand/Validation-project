import React from 'react'
import './Formpopup.css'
import Create_For_User  from '../UserEntry/Create_For_User';
// import { useContext } from 'react';
// import { UserContext } from '../../../usecontext';

const Formpopup = ({isVisible,onClose}) => {

  // const {value} = useContext(UserContext)

  // const role = localStorage.getItem("role")

    if(!isVisible) return null;

  return (
    <>
     <div className='form-overlay'>
      <div className='form-content'>
         {/* {value.length>0 && (
          <button className='btn-form' onClick={onClose}>&times;</button>
         )} */}
         <Create_For_User close={onClose}/>
      </div>
    </div>
    </>
  )
}

export default Formpopup

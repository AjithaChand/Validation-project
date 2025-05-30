import React from 'react'
import './Formpopup.css'
import Create_For_User  from '../UserEntry/Create_For_User';

const Formpopup = ({isVisible,onClose}) => {

    if(!isVisible) return null;

  return (
    <>
     <div className='form-overlay'>
      <div className='form-content'>
          <button className='btn-form' onClick={onClose}>&times;</button>
         <Create_For_User close={onClose}/>
      </div>
    </div>
    </>
  )
}

export default Formpopup

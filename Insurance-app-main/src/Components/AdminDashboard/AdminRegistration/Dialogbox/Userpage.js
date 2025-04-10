import React from 'react'
import '../Dialogbox/Userpage.css'
import Adminregister from '../RegisterForm/Adminregister';

const Userpage = ({isVisible,onClose}) => {

  if(!isVisible) return null;

  return (
    <div className='dialog-overlay'>
      <div className='dialog-content'>
        <button className='btn-close' onClick={onClose}>&times;</button>
        <Adminregister close={onClose}/>
      </div>
    </div>
  )
}

export default Userpage

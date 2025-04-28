import React from 'react'
import '../Dialogbox/Userpage.css'
import Adminregister from '../RegisterForm/Adminregister';

const Userpage = ({isVisible,onClose}) => {

  if(!isVisible) return null;

  const handleClick = (e)=>{
    e.stopPropagation()
  }

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <div className='dialog-content' onClick={handleClick}>
        <button className='btn-close' onClick={onClose}>&times;</button>
        <Adminregister close={onClose}/>
      </div>
    </div>
  )
}

export default Userpage

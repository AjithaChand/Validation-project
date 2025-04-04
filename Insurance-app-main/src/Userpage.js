import React from 'react'
import './Userpage.css'
import Adminregister from './Adminregister';

const Userpage = ({isVisible,onClose}) => {

  if(!isVisible) return null;

  return (
    <div className='dialog-overlay'>
      <div className='dialog-content'>
        <button className='btn-close' onClick={onClose}>&times;</button>
        <Adminregister/>
      </div>
    </div>
  )
}

export default Userpage

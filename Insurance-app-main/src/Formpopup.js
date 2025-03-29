import React from 'react'
import './Formpopup.css'
import Create from './Create';

const Formpopup = ({isVisible,onClose}) => {

    if(!isVisible) return null;

  return (
    <div className='form-overlay'>
      <div className='form-content'>
         <button className='btn-form' onClick={onClose}>&times;</button>
         <Create/>
      </div>
    </div>
  )
}

export default Formpopup

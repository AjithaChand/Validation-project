import React from 'react';
import './Updatebox.css'
import Updatefile from '../../../Admincreateform/Updatefile';

const UpdateBox = ({ isVisible, onClose, userid }) => {

  if (!isVisible) return null;

  const handleClick = (e)=>{
    e.stopPropagation()
  }

  return (
    <div className='form-overlay-update' onClick={onClose}>
    <div className='form-content-update' onClick={handleClick}>
       <button className='btn-form-update' onClick={onClose}>&times;</button>
       <Updatefile close={onClose} selectid={userid}/>
    </div>
  </div>
  );
};

export default UpdateBox;

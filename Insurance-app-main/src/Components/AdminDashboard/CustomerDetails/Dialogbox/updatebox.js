import React from 'react';
import './Updatebox.css'
import Updatefile from '../../../Admincreateform/Updatefile';

const UpdateBox = ({ isVisible, onClose, userid }) => {
  if (!isVisible) return null;

  return (
    <div className='form-overlay'>
    <div className='form-content'>
       <button className='btn-form' onClick={onClose}>&times;</button>
       <Updatefile close={onClose}/>
    </div>
  </div>
  );
};

export default UpdateBox;

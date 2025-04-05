import React from 'react';
import './Updatebox.css'
import Updatefile from '../../../Admincreateform/Updatefile';

const UpdateBox = ({ isVisible, onClose, userid }) => {
  if (!isVisible) return null;

  return (
    <div className="updatebox-overlay">
      <div className="updatebox-content">
        <button className="btn-updatebox" onClick={onClose}>
          &times;
        </button>
        <div className="update-inner">
          <Updatefile close={onClose} selectid={userid} />
        </div>
      </div>
    </div>
  );
};

export default UpdateBox;

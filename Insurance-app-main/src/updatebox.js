import React from 'react';
import './UpdateDialog.css';
import Updatefile from './Updatefile';

const UpdateBox = ({ isVisible, onClose, userid }) => {
  if (!isVisible) return null;

  return (
    <div className="update-overlay">
      <div className="update-content">
        <button className="btn-update" onClick={onClose}>
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

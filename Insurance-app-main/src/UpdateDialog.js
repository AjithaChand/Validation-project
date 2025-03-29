import React from 'react'
import './UpdateDialog.css'
import Updatedata from './Updatedata';

const UpdateDialog = ({isVisible,onClose,userid}) => {
    if(!isVisible) return null;

    return (
      <div className='update-overlay'>
        <div className='update-content'>
          <button className='btn-update' onClick={onClose}>&times;</button>
          <Updatedata selectid={userid}/>
        </div>
      </div>
    )
}

export default UpdateDialog;

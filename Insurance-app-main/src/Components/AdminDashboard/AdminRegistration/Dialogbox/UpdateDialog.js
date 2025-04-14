import React from 'react'
import '../Dialogbox/UpdateDialog.css'
import Updatedata from '../Updateform/Updatedata';

const UpdateDialog = ({isVisible,onClose,userid,useremail}) => {
    if(!isVisible) return null;
    return (
      <div className='update-overlay'>
      <div className='update-content'>
        <button className='btn-update' onClick={onClose}>&times;</button>
        <div className='update-inner'>
          <Updatedata close={onClose} selectid={userid} selectemail={useremail}/>
         </div>
      </div>
    </div>
    
    )
}

export default UpdateDialog;

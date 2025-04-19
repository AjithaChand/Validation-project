import React from 'react'
import '../Dialogbox/UpdateDialog.css'
import Updatedata from '../Updateform/Updatedata';

const UpdateDialog = ({isVisible,onClose,userid,useremail}) => {

    if(!isVisible) return null;

    const handleClick = (e)=>{
      e.stopPropagation()
    }

    return (
      <div className='update-overlay-user' onClick={onClose}>
      <div className='update-content-user' onClick={handleClick}>
        <button className='btn-update-user' onClick={onClose}>&times;</button>
        <div className='update-inner-user'>
          <Updatedata close={onClose} selectid={userid} selectemail={useremail}/>
         </div>
      </div>
    </div>
    
    )
}

export default UpdateDialog;

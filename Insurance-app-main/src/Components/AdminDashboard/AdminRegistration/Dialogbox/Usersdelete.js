import React from 'react'
import './Usersdelete.css'

const UserDialog = ({isVisible,onClose,cancel,logout}) => {

    if(!isVisible) return null;

    const handleClick = (e) =>{
      e.stopPropagation();
    }
  return (
    <div className='userdeletedialog-overlay text-center' onClick={cancel}>
        <div className='userdeletedialog-content' onClick={handleClick}>
          <div className='userdelete-boxhover'>
            <div className="userdelete-confirmbox">
              <p>Are you sure ?</p>
              <div className='userdelete-box'>
                <button className="userdelete-cancel-btn" onClick={cancel}>Cancel</button>
                <button className="userdelete-confirm-btn" onClick={logout}>Delete</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDialog

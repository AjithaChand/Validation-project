import React from 'react'
import './UserDialog.css'

const UserDialog = ({isVisible,onClose,cancel,logout}) => {

    if(!isVisible) return null;
  return (
    <div className='userdialog-overlay text-center'>
        <div className='userdialog-content'>
          <div className='user-boxhover'>
            <div className="user-confirmbox">
              <p>Are you sure you want to logout?</p>
              <div className='user-box'>
                <button className="user-confirm-btn" onClick={logout}>Confirm</button>
                <button className="user-cancel-btn" onClick={cancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDialog

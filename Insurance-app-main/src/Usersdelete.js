import React from 'react'
import './Usersdelete.css'

const UserDialog = ({isVisible,onClose,cancel,logout}) => {

    if(!isVisible) return null;
  return (
    <div className='userdeletedialog-overlay text-center'>
        <div className='userdeletedialog-content'>
          <div className='userdelete-boxhover'>
            <div className="userdelete-confirmbox">
              <p>Are you sure ?</p>
              <div className='userdelete-box'>
                <button className="userdelete-confirm-btn" onClick={logout}>Confirm</button>
                <button className="userdelete-cancel-btn" onClick={cancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDialog

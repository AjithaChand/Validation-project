import React from 'react'
import './UserDialog.css'

const UserDialog = ({isVisible,cancel,logout}) => {

    if(!isVisible) return null;

    const handleClick = (e)=>{
      e.stopPropagation()
    }

  return (
    <div className='userdialog-overlay text-center' onClick={cancel}>
        <div className='userdialog-content' onClick={handleClick}>
          <div className='user-boxhover'>
            <div className="user-confirmbox">
              <p>Are you sure you want to logout?</p>
              <div className='user-box'>
                <button className="user-cancel-btn" onClick={cancel}>Cancel</button>
                <button className="user-confirm-btn" onClick={logout}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDialog

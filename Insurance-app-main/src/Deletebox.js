import React from 'react'
import './Deletebox.css'

const UserDialog = ({isVisible,onClose,cancel,logout}) => {

    if(!isVisible) return null;
  return (
    <div className='deletedialog-overlay text-center'>
        <div className='deletedialog-content'>
          <div className='delete-boxhover'>
            <div className="delete-confirmbox">
              <p>Are you sure ?</p>
              <div className='delete-box'>
                <button className="delete-confirm-btn" onClick={logout}>Delete</button>
                <button className="delete-cancel-btn" onClick={cancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDialog

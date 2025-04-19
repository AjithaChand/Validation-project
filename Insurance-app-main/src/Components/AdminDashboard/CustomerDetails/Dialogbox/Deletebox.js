import React from 'react'
import '../Dialogbox/Deletebox.css'

const UserDialog = ({isVisible,cancel,logout}) => {

    if(!isVisible) return null;

    const handleClick = (e)=>{
      e.stopPropagation()
    }

  return (
    <div className='deletedialog-overlay text-center' onClick={cancel}>
        <div className='deletedialog-content' onClick={handleClick}>
          <div className='delete-boxhover'>
            <div className="delete-confirmbox">
              <p>Are you sure ?</p>
              <div className='delete-box'>
                <button className="delete-cancel-btn" onClick={cancel}>Cancel</button>
                <button className="delete-confirm-btn" onClick={logout}>Delete</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDialog

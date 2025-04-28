import React from 'react'
import './DeleteAllusers.css'

const DeleteAllusers = ({onClose , isVisible , deleteIds}) => {
    if (!isVisible) return null;

    const handleClick = (e) => {
        e.stopPropagation();
    }

    return (
        <div className='alluserdeletedialog-overlay text-center' onClick={onClose}>
            <div className='alluserdeletedialog-content' onClick={handleClick}>
                <div className='alluserdelete-box'>
                    <div className="alluserdelete-confirmbox">
                        <p>Are you sure want to delete all details?</p>
                        <div className='alluserdelete-box'>
                            <button className="alluserdelete-cancel-btn" onClick={onClose}>Cancel</button>
                            <button className="alluserdelete-confirm-btn" onClick={deleteIds}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteAllusers

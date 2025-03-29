import React from 'react'
import Create from './Create'
import './Detailspopup.css'

const Detailspopup = ({isVisible,onClose}) => {
    if(!isVisible) return null;

    return (
      <div className='create-overlay'>
        <div className='create-content'>
          <button className='btn-create' onClick={onClose}>&times;</button>
          <Create/>
        </div>
      </div>
    )
}

export default Detailspopup

import React from 'react'
import '../Dialogbox/Detailspopup.css'
import Create from '../../../Admincreateform/Create';

const Detailspopup = ({isVisible,onClose}) => {

    if(!isVisible) return null;

    const handleClick = (e)=>{
      e.stopPropagation()
    }

    return (
      <div className='create-overlay-admin' onClick={onClose}>
        <div className='create-content-admin' onClick={handleClick}>
          <button className='btn-create-admin' onClick={onClose}>&times;</button>
          <Create close={onClose}/>
        </div>
      </div>
    )
}

export default Detailspopup

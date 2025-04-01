import React from 'react'
import './Editdialog.css'
import Editdata from './Editdata';

const Editdialog = ({isVisible,onClose,userid}) => {

    if(!isVisible) return null;

  return (
    <div className='edit-overlay'>
      <div className='edit-content'>
        <button className='btn-edit' onClick={onClose}>&times;</button>
        <Editdata close={onClose} selectid={userid}/>
      </div>
    </div>
  )
}

export default Editdialog

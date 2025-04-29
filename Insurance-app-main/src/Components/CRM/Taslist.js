import React from 'react'
import "./Taklist.css"

const Tasklist = () => {
  return (
    <div className='task-bar'>
        <div className='task-list'>
        <h6>CRM Portel</h6>
      <form>
        <label>Email</label>
        <input className='value' type='email'></input>
        <label>Name</label>
        <input className='value' type='text'></input>
        <label>Task</label>
        <input className='value' type='text'></input>
        <label>Start Date</label>
        <input className='value' type='date'></input>
        <label>End Date</label>
        <input className='value' type='date'></input>
      </form>
      </div>
    </div>
  )
}

export default Tasklist

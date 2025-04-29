import React, { useState, useEffect } from 'react';
import '../CRM/Taklist.css';
import axios from 'axios';
import { apiurl } from '../../url';

const Taslist = () => {
  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    project: '',
    task: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [employees, setEmployees] = useState([]);
  
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        const res = await axios.get(`${apiurl}/get-all-employeenames`);
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employee names", error);
      }
    };
    fetchEmployeeNames();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "empId") {
      const selectedEmp = employees.find(emp => emp.emp_id.toString() === value);
      setFormData(prev => ({
        ...prev,
        empId: value,
        empName: selectedEmp ? selectedEmp.emp_name : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSubmitcrm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiurl}/add-crm`, formData);
      console.log("CRM added", res.data);
      setFormData({
        empId: '',
        empName: '',
        project: '',
        task: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    } catch (err) {
      console.error("Error submitting CRM", err);
    }
  };

 
  return (
    <div className='task-bar'>
      <div className='task-list'>
        <h6>CRM Portal</h6>
        <form onSubmit={handleSubmitcrm}>
          <label>Employee</label>
          <select className='value' name='empId' onChange={handleChange}>
            <option value=''>Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_name}
              </option>
            ))}
          </select>

          <label>Project</label>
          <input className='value' type='text' name='project' onChange={handleChange} />

          <label>Task</label>
          <input className='value' type='text' name='task' onChange={handleChange} />

          <label>Description</label>
          <input className='value' type='text' name='description' onChange={handleChange} />

          <label>Start Date</label>
          <input className='value' type='date' name='startDate' onChange={handleChange} />

          <label>End Date</label>
          <input className='value' type='date' name='endDate' onChange={handleChange} />

          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Taslist;

import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiurl } from './url';

const Updatefile = ({ close }) => {
  const email = localStorage.getItem('email');

  const [values, setValues] = useState({
    startdate: '',
    enddate: '',
    policy: '',
    file: null,
  });

  const handleFileChange = (e) => {
    setValues({ ...values, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.startdate || !values.enddate || !values.policy || !values.file) {
      toast.error("Please fill all fields and choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append('startdate', values.startdate);
    formData.append('enddate', values.enddate);
    formData.append('policy', values.policy);
    formData.append('file', values.file);

    try {
      const res = await axios.put(`${apiurl}/update-data-in-admin/${email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message);
      if (typeof close === 'function') close();
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">Update Your Details</h3>

        <div className="mt-3 form-group">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={values.startdate}
            onChange={(e) => setValues({ ...values, startdate: e.target.value })}
          />
        </div>

        <div className="mt-3 form-group">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={values.enddate}
            onChange={(e) => setValues({ ...values, enddate: e.target.value })}
          />
        </div>

        <div className="mt-3 form-group">
          <label>Policy</label>
          <input
            type="text"
            className="form-control"
            value={values.policy}
            onChange={(e) => setValues({ ...values, policy: e.target.value })}
          />
        </div>

        <div className="mt-3 form-group">
          <label>Upload File</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <button className="btn btn-dark mt-3">Submit</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Updatefile;

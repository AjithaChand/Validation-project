import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiurl } from './url';

const Updatefile = ({ close }) => {
  const [email, setEmail] = useState('');
  const [values, setValues] = useState({
    email:'',
    startdate: '',
    enddate: '',
    policy: '',
    file: null,
  });
useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setEmail(email);
      axios.get(`${apiurl}/read-data-by-email/${email}`)
        .then((res) => {
          const data = res.data.result[0];
          setValues({
            email:data.email,
            startdate: data.startdate?.split('T')[0] || '',
            enddate: data.enddate?.split('T')[0] || '',
            policy: data.policy || '',
            file: null,
          });
        })
        .catch(() => {
          toast.error("Failed to fetch user data");
        });
    } else {
      toast.error("User email not found");
    }
  }, []);

  const handleFileChange = (e) => {
    setValues({ ...values, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startdate, enddate, policy, file } = values;

    if (!email || !startdate || !enddate || !policy || !file) {
      toast.error("Please fill all fields and choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('startdate', startdate);
    formData.append('enddate', enddate);
    formData.append('policy', policy);
    formData.append('file', file);

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
          <label>Email (Read Only)</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={e=>setValues({...values,email:e.target.value})}
            readOnly
          />
        </div>

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
          <label>Upload New File</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button className="btn btn-dark mt-3">Update</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Updatefile;

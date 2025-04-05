import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiurl } from '../../../url';
import { UserContext } from "../../../usecontext"; 


const Create_For_User = ({ close }) => {

  // const {setShareId} = useContext(UserContext);

  const email = localStorage.getItem('email');

  const {setRefreshFromCreate} = useContext(UserContext)

  const currentDate = new Date();
  const formattedDateForInput = currentDate.toISOString().split("T")[0];

  const [values, setValues] = useState({
    email: email || '',
    startdate: formattedDateForInput,
    enddate: '',
    policy: '',
    file: null,
  });

  // const { setShareEmail } = useContext(UserContext);


  const handleFileChange = (e) => {
    setValues({ ...values, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('startdate', values.startdate);
    formData.append('enddate', values.enddate);
    formData.append('policy', values.policy);
    formData.append('file', values.file);


    axios
      .post(`${apiurl}/create-for-user`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        console.log('Response:', res);
        if (typeof close === 'function') {
          toast.success(res.data.message);
          setRefreshFromCreate(pre=>!pre)
          close();
        }

      })
      .catch((err) => {
        console.log('Error:', err);
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        }
      });
  };



  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">User Create Data</h3>

        <div className="mt-3 form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
            value={values.email}
            readOnly
          />
        </div>

        <div className='mt-3 form-group'>
          <input
            type="date"
            className="form-control"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
            value={values.startdate}
            readOnly
          />
        </div>

        <div className="mt-3 form-group">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
            value={values.enddate}
            onChange={(e) => setValues({ ...values, enddate: e.target.value })}
          />
        </div>

        <div className="mt-3 form-group">
          <label>Policy</label>
          <input
            type="text"
            className="form-control"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
            value={values.policy}
            onChange={(e) => setValues({ ...values, policy: e.target.value })}
          />
        </div>

        <div className="mt-3">
          <input
            type="file"
            accept="/"
            onChange={handleFileChange}
            className="mt-3"
          />
        </div>

        <button
          className="btn user-btn mt-3"
          style={{ backgroundColor: '#333', width: '30%' }}
        >
          Submit
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Create_For_User;
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import '../Updateform/Updatedata.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../../url';
import '../Updateform/Updatedata.css';
import { UserContext } from '../../../../usecontext';

const Updatedata = ({ selectid, close, selectemail }) => {

  const [refresh, setRefresh] = useState(false)

  const { setUpdateOldUser } = useContext(UserContext)

  const [datas, setData] = useState({
    username: "",
    email: "",
    password: "",
    total_salary: "",
    esi_number: "",
    pf_number: ""

  })

  // permission update code

  const [permission, setPermission] = useState({
    'dashboard': { read: false, create: false, update: false, delete: false },
    'payslip': { read: false, create: false, update: false, delete: false },
    'users': { read: false, create: false, update: false, delete: false },
    'attendance': { read: false, create: false, update: false, delete: false },
  });


  const [person_code, setPerson_code] = useState(null)

  console.log("person_code from backend update", person_code)

  useEffect(() => {
    if (datas.email) {
      axios.get(`${apiurl}/get-person_code?email=${datas.email}`)
        .then(res => {
          setPerson_code(res.data.person_code);
          const permissionData = res.data.permissions;

          if (permissionData.length > 0) {
            const formatted = {};

            permissionData.forEach(p => {
              formatted[p.page_name] = {
                create: Boolean(p.can_create),
                read: Boolean(p.can_read),
                update: Boolean(p.can_update),
                delete: Boolean(p.can_delete),
              };
            });

            setPermission(formatted);
          }
        })

        .catch(err => console.log(err))
    }
  }, [datas.email])

  const handleSalarychange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setData(prev => ({
        ...prev,
        total_salary: "",
        pf_amount: "",
        esi_amount: "",
        net_amount: "",
        gross_salary: "",
        bank_details: ""
      }));
      return;
    }

    const salary = parseFloat(value);
    if (isNaN(salary)) return;

    const pf = (salary * 0.12).toFixed(2);
    const esi = (salary * 0.0075).toFixed(2);
    const net = (salary - pf - esi).toFixed(2);
    const gross_salary = salary;

    const workingDays = 30;
    const leaveDays = 3;

    const perDayNetSalary = net / workingDays;
    console.log(perDayNetSalary, "perdaysalary");

    const workedDays = workingDays - leaveDays;
    console.log("WorkedDays", workedDays);

    const revisedNet = perDayNetSalary * workedDays;
    console.log("Revised Salary", revisedNet);

    setData(prev => ({
      ...prev,
      total_salary: salary,
      pf_amount: pf,
      esi_amount: esi,
      net_amount: net,
      gross_salary,
      revised_salary: revisedNet
    }));
  };

  useEffect(() => {

    if (!selectemail) return;

    axios.get(`${apiurl}/getuser/single?email=${selectemail}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.data) {
          setData(res.data)
          console.log(res.data, "In UpdateData");

        } else {
          toast.error("User not found!")
        }
      })
      .catch(err => console.log(err))
  }, [selectemail, refresh])

  const handleSubmit = async (e) => {

    console.log("For Update submit", datas);

    e.preventDefault();

    try {
      const userUpdate = await axios.put(`${apiurl}/edituser/${selectid}`, datas, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success(userUpdate.data.message)
      setUpdateOldUser(pre => !pre)
      close()
      setRefresh(!refresh)

      const passwordChange = await axios.post(`${apiurl}/password_changed`, {
        email: datas.email,
        password: datas.password
      })

      if (passwordChange.data.success) {
        toast.success(`Send Email To ${datas.email}`)
      }

      const personcode = await axios.get(`${apiurl}/get-person_code?email=${datas.email}`);
      const code = personcode.data.person_code;

      console.log("Final person_code for permission update:", code);
      

      if (!code) {
        toast.error("Person code not found for permission update");
        return;
      }

      // permission update code

      await axios.put(`${apiurl}/update-permissions?person_code=${code}`, {
        permissions: permission
      })
      console.log("Permission payload:", permission);
      toast.success("Permission updated")
    }

    catch (err) {
      console.log(err)
      toast.error(err.response?.data?.error || "Something went wrong");
    }

  }

  return (
    <div >
      <form onSubmit={handleSubmit} className='update-form' >
        <h3 className='text-center updatehead mt-2'>Update Data</h3>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Username</label>
          <input className='form-control' type='text' value={datas.username} onChange={e => setData({ ...datas, username: e.target.value })} placeholder='Enter your username' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Email</label>
          <input type='email' className='form-control' value={datas.email} onChange={e => setData({ ...datas, email: e.target.value })} placeholder='Enter your email' readOnly />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Password</label>
          <input type='password' className='form-control' value={datas.password} onChange={e => setData({ ...datas, password: e.target.value })} placeholder='Enter your password' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Salary</label>
          <input
            type='number'
            className='form-control'
            value={datas.total_salary}
            onChange={handleSalarychange}
            placeholder='Enter your salary'
          />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>ESI Number</label>
          <input type='text' className='form-control' value={datas.esi_number} onChange={e => setData({ ...datas, esi_number: e.target.value })} placeholder='Enter ESI Number' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>PF Number</label>
          <input type='text' className='form-control' value={datas.pf_number} onChange={e => setData({ ...datas, pf_number: e.target.value })} placeholder='Enter ESI Number' />
        </div>
        <div className='form-group mt-3'>
          <label className='userupdate-label'>Bank Details</label>
          <input type='text' className='form-control' value={datas.bank_details} onChange={e => setData({ ...datas, bank_details: e.target.value })} placeholder='Enter Bank Details' />
        </div>

        <div className='mt-3 col-12 form-group'>
          <div className='permissions-role mt-2'>
            <label htmlFor='permission' className='register-label'>Permissions:</label>
            <select id='permission' className='form-control' >
              <option value="">Please Select</option>
              <option value="dashboard">Dashboard</option>
              <option value="payslip">Payslip</option>
              <option value="users">Users</option>
              <option value="attendance">Attendance</option>
            </select>
          </div>
        </div>

        <div className='mt-3 col-12 form-group'>
          <div className='permissions-role-table mt-2'>
            <table className='permission-table text-center'>
              <thead>
                <tr>
                  <th>Permissions</th>
                  <th>Create</th>
                  <th>Read</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dashboard</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.dashboard.create}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        dashboard: { ...prev.dashboard, create: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.dashboard.read}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        dashboard: { ...prev.dashboard, read: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.dashboard.update}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        dashboard: { ...permission.dashboard, update: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.dashboard.delete}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        dashboard: { ...permission.dashboard, delete: e.target.checked }
                      }))}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Payslip</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.payslip.create}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        payslip: { ...prev.payslip, create: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.payslip.read}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        payslip: { ...prev.payslip, read: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.payslip.update}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        payslip: { ...permission.payslip, update: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.payslip.delete}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        payslip: { ...permission.payslip, delete: e.target.checked }
                      }))}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Users</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.users.create}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        users: { ...prev.users, create: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.users.read}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        users: { ...prev.users, read: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.users.update}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        users: { ...permission.users, update: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.users.delete}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        users: { ...permission.users, delete: e.target.checked }
                      }))}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Attendance</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.attendance.create}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, create: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.attendance.read}
                      onChange={e => setPermission(prev => ({
                        ...prev,
                        attendance: { ...prev.attendance, read: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.attendance.update}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        attendance: { ...permission.attendance, update: e.target.checked }
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.attendance.delete}
                      onChange={e => setPermission(permission => ({
                        ...permission,
                        attendance: { ...permission.attendance, delete: e.target.checked }
                      }))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button className='btn userupdate-btn mt-4' style={{ backgroundColor: "#333" }}>Submit</button>
      </form>

      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Updatedata
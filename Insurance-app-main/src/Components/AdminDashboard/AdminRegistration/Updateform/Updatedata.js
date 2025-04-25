import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import '../Updateform/Updatedata.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiurl } from '../../../../url';
import { UserContext } from '../../../../usecontext';
import { Switch, FormControlLabel } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Updatedata = ({ selectid, close, selectemail }) => {

  const [refresh, setRefresh] = useState(false)

  const { setUpdateOldUser } = useContext(UserContext)
  //Account deactivate functionality

  const [isActive, setIsActive] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  }

  const [datas, setData] = useState({
    username: "",
    email: "",
    password: "",
    total_salary: "",
    esi_number: "",
    pf_number: "",
    bank_details: "",
    is_active: 1,
    address: "",
    phone_number: "",
    branch_name: "",
    station_name: "",
    latitude: "",
    longitude: "",

  })


  // permission update code

  const [permission, setPermission] = useState({
    'dashboard': { read: false, create: false, update: false, delete: false },
    'register': { read: false, create: false, update: false, delete: false },
    'user_attendance': { read: false, create: false, update: false, delete: false },
    'payslip': { read: false, create: false, update: false, delete: false },
    'users': { read: false, create: false, update: false, delete: false },
    'attendance': { read: false, create: false, update: false, delete: false },
    'settings': { read: false, create: false, update: false, delete: false },
  });



  const [person_code, setPerson_code] = useState(null)

  console.log("person_code from backend update", person_code)
  console.log("permissions", permission)

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
  const toggleParentPermission = (parentKey, childKeys) => {
    const allChecked = ['create', 'read', 'update', 'delete'].every(action =>
      permission[parentKey][action] && childKeys.every(child => permission[child][action])
    );

    const updatedPermissions = { ...permission };

    ['create', 'read', 'update', 'delete'].forEach(action => {
      updatedPermissions[parentKey][action] = !allChecked;
      childKeys.forEach(child => {
        updatedPermissions[child][action] = !allChecked;
      });
    });

    setPermission(updatedPermissions);
  };

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
          console.log(res.data, "checking")
          setData(res.data)
          setIsActive(res.data.is_active === 1);
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
      console.log(datas.is_active, "checking for sending activate")
      console.log(datas.address, datas.phone_number, "Checking phone number and adress")

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
  console.log(datas, "data")
  return (
    <div >
      <div className='container'>
        <form onSubmit={handleSubmit} className='update-form' >
          <h3 className='text-center updatehead mt-2'>Update Data</h3>
          <div className='row'>
            <div className='col-md-6 col-sm-12  form-group mt-3'>
              <label className='userupdate-label'>Username</label>
              <input className='form-control' type='text' value={datas.username} onChange={e => setData({ ...datas, username: e.target.value })} placeholder='Enter your username' />
            </div>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>Email</label>
              <input type='email' className='form-control' value={datas.email} onChange={e => setData({ ...datas, email: e.target.value })} placeholder='Enter your email' readOnly />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6 col-sm-12 form-group mt-3 password-wrapper-update'>
              <label className='userupdate-label'>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className='form-control '
                value={datas.password}
                onChange={e => setData({ ...datas, password: e.target.value })}
                placeholder='Enter your password'
              />
              <span className="eye-icon-update" onClick={toggleVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>Salary</label>
              <input
                type='number'
                className='form-control'
                value={datas.total_salary}
                onChange={handleSalarychange}
                placeholder='Enter your salary'
              />
            </div>

          </div>
          <div className='row'>
            <div className='mt-3 col-md-6 col-sm-12 form-group'>
              <label className='register-label'>Address :</label>
              <textarea className='form-control' value={datas.address} onChange={e => setData({ ...datas, address: e.target.value })} placeholder='Enter your Address'></textarea>
            </div>
            <div className='mt-3 col-md-6 col-sm-12 form-group'>
              <label className='register-label'>Phone No:</label>
              <input type='number' className='form-control' value={datas.phone_number} onChange={e => setData({ ...datas, phone_number: e.target.value })} placeholder='Enter Your Phone number' required />
            </div>

          </div>
          <div className='row'>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>ESI Number</label>
              <input type='text' className='form-control' value={datas.esi_number} onChange={e => setData({ ...datas, esi_number: e.target.value })} placeholder='Enter ESI Number' />
            </div>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>PF Number</label>
              <input type='text' className='form-control' value={datas.pf_number} onChange={e => setData({ ...datas, pf_number: e.target.value })} placeholder='Enter ESI Number' />
            </div>
          </div>

          <div className='form-group  mt-3'>
            <label className='userupdate-label'>Bank Details</label>
            <textarea className='form-control' value={datas.bank_details} onChange={e => setData({ ...datas, bank_details: e.target.value })} placeholder='Enter Bank Details' />
          </div>

          <div className='row'>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>Branch</label>
              <input type='text' className='form-control' value={datas.branch_name} onChange={e => setData({ ...datas, branch_name: e.target.value })} placeholder='Enter Branch' />
            </div>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>Station</label>
              <input type='text' className='form-control' value={datas.station_name} onChange={e => setData({ ...datas, station_name: e.target.value })} placeholder='Enter Station' />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>Latitude</label>
              <input type='float' className='form-control' value={datas.latitude} onChange={e => setData({ ...datas, latitude: e.target.value })} placeholder='Enter Latitude' />
            </div>
            <div className='col-md-6 col-sm-12 form-group mt-3'>
              <label className='userupdate-label'>Longitude</label>
              <input type='float' className='form-control' value={datas.longitude} onChange={e => setData({ ...datas, longitude: e.target.value })} placeholder='Enter Longitude' />
            </div>
          </div>

          <div className='col-md-6 col-sm-12 mt-4 ms-3'>
            <label>Activate</label>
            <label className='ms-3'>
              <input type='radio' value='1'
                checked={isActive === true}
                onChange={(e) => {
                  setIsActive(true);
                  setData({ ...datas, is_active: 1 })
                }}
              />Yes
            </label>
            <label className='ms-3'>
              <input type='radio'
                value='0'
                checked={isActive === false}
                onChange={(e) => {
                  setIsActive(false);
                  setData({ ...datas, is_active: 0 })
                }} />No
            </label>
          </div>
          <div className='mt-3 col-12 form-group'>
            <div className='permissions-role-table mt-2'>
              <table className='permission-table text-center'>
                <thead>
                  <tr>
                    <th>Permissions</th>
                    <th></th>
                    <th>Create</th>
                    <th>Read</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dashboard</td>
                    <td></td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.dashboard?.create}
                        onChange={e => setPermission(prev => ({
                          ...prev,
                          dashboard: { ...prev.dashboard, create: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.dashboard?.read}
                        onChange={e => setPermission(prev => ({
                          ...prev,
                          dashboard: { ...prev.dashboard, read: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.dashboard?.update}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          dashboard: { ...permission.dashboard, update: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.dashboard?.delete}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          dashboard: { ...permission.dashboard, delete: e.target.checked }
                        }))}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>Register</td>
                    <td></td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.register?.create}
                        onChange={e => setPermission(prev => ({
                          ...prev,
                          register: { ...prev.register, create: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.register?.read}
                        onChange={e => setPermission(prev => ({
                          ...prev,
                          register: { ...prev.register, read: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.register?.update}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          register: { ...permission.register, update: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.register?.delete}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          register: { ...permission.register, delete: e.target.checked }
                        }))}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Attendance</td>
                    <td>
                      <FormControlLabel
                        control={
                          <Switch
                            type="checkbox"
                            checked={
                              ['create', 'read', 'update', 'delete'].every(
                                action =>
                                  permission.attendance[action] && permission.payslip[action]
                              )
                            }
                            onChange={() => toggleParentPermission('attendance', ['payslip'])}
                          />
                        }
                      />
                    </td>
                  </tr>


                  <tr>
                    <td>Attendance</td>
                    <td></td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.attendance.create}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          attendance: { ...permission.attendance, create: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.attendance.read}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          attendance: { ...permission.attendance, read: e.target.checked }
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
                  <tr>
                    <td>Payslip</td>
                    <td></td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.payslip.create}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          payslip: { ...permission.payslip, create: e.target.checked }
                        }))}

                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.payslip.read}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          payslip: { ...permission.payslip, read: e.target.checked }
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
                    <td>User Attendance</td>
                    <td></td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.user_attendance?.create}
                        onChange={e => setPermission(prev => ({
                          ...prev,
                          user_attendance: { ...prev.user_attendance, create: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.user_attendance?.read}
                        onChange={e => setPermission(prev => ({
                          ...prev,
                          user_attendance: { ...prev.user_attendance, read: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.user_attendance?.update}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          user_attendance: { ...permission.user_attendance, update: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.user_attendance?.delete}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          user_attendance: { ...permission.user_attendance, delete: e.target.checked }
                        }))}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Settings  </td>

                    <td>
                      <FormControlLabel
                        control={
                          <Switch
                            type="checkbox"
                            checked={
                              ['create', 'read', 'update', 'delete'].every(
                                action =>
                                  permission.settings[action] && permission.users[action]
                              )
                            }
                            onChange={() => toggleParentPermission('settings', ['users'])}
                          />
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Settings</td>
                    <td></td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.settings?.create}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          settings: { ...permission.settings, create: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.settings?.read}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          settings: { ...permission.settings, read: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.settings.update}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          settings: { ...permission.settings, update: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.settings.delete}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          settings: { ...permission.settings, delete: e.target.checked }
                        }))}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Users</td>
                    <td></td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.users.create}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          users: { ...permission.users, create: e.target.checked }
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={permission.users.read}
                        onChange={e => setPermission(permission => ({
                          ...permission,
                          users: { ...permission.users, read: e.target.checked }
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
                </tbody>
              </table>
            </div>
          </div>

          <button className='btn userupdate-btn mt-4'>Submit</button>
        </form>
      </div>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Updatedata
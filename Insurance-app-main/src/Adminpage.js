import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Adminpage.css'
import Detailspopup from './Detailspopup';
import { RiDeleteBinFill } from "react-icons/ri";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoIosCloudUpload } from "react-icons/io";

const Adminpage = () => {

  const [file, setFile] = useState(null);

  const handleDownload = () => {
    window.location.href = "http://localhost:8000/download-excel";
  }

  const handleUpload = async () => {

    if (!file) return alert("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload-excel", formData);
      alert("File uploaded successfully!")
    } catch (err) {
      alert("Upload  failed")
    }

  }

  const [showpopup, setShowpopup] = useState(false)

  const handlePopup = () => {
    setShowpopup(!showpopup)
  }

  const [value, setValue] = useState([])

  // Fetch files from backend
  useEffect(() => {
    axios.get('http://localhost:8000')
      .then(res => setValue(res.data))
      .catch(err => console.log(err))
  }, [])

  // Delete values
  const handleDelete = (id) => {
    axios.delete('http://localhost:8000/delete/' + id)
      .then(res => {
        alert("Are you sure you want to delete this data?")
        console.log(res)
        setValue(prev => prev.filter(data => data.id !== id))
      })
      .catch(err => alert(err.response.data.error))
  }

  // // View files
  // const [open,setOpen] = useState(false)
  // const [selectedFile,setSelectedfile] = useState(null)

  //   // handle dialog open
  //   const handleOpen = (data) =>{
  //     setSelectedfile(data.files[0])
  //     setOpen(true)
  //   }

  //    // handle dialog close
  //    const handleClose = (data) =>{
  //     setOpen(false)
  //     setSelectedfile(null)
  //   }

  return (
    <div>
      <div>
        <h2>Admin Dashboard</h2>
      </div>
      <div className='row'>
        <div className='col-12'>
          <h4 className='text-center p-4' style={{ paddingTop: "50px" }}>Customer Details</h4>
          <div className='admin-header'>
            <button className='upload-button1' onClick={handleDownload}><PiMicrosoftExcelLogoFill /></button>
            <input type='file' id="fileInput" className='file-input' onChange={(e) => setFile(e.target.files[0])} />
            <label for="fileInput" className="file-label pt-4">
              <span className='label-name'>Choose File</span>
            </label>
            {file && <span className="file-name">{file.name}</span>}
            <button className='upload-button2' onClick={handleUpload}><IoIosCloudUpload /></button>
          </div>
          <table className='mt-5 admin-table' border={1}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Policy</th>
                <th>Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {value.map((data, index) => {
                return <tr key={index}>
                  <td>{data.email}</td>
                  <td>{data.startdate}</td>
                  <td>{data.enddate}</td>
                  <td>{data.policy}</td>
                  <td>
                    <button className='view-button' onClick={()=>handleOpen(data)}>View File</button>
                  </td>
                  <td>
                    <button className=' ps-3 pe-3 delete-btn' onClick={() => handleDelete(data.id)}>Delete</button>
                  </td>
                </tr>
              })}

              <tr>
                <td>nisha</td>
                <td>10/02/2025</td>
                <td>12/02/2025</td>
                <td>medical insurance</td>
                <td>file</td>
                <td className='delete-button' onClick={() => handleDelete()}><RiDeleteBinFill /></td>
              </tr>

            </tbody>
          </table>
          <div className='mt-5'>
            <button className='btn admin-btn' onClick={handlePopup}>Add Details</button>
          </div>
        </div>
      </div>
      <Detailspopup isVisible={showpopup} onClose={handlePopup} />

      
    </div>
  )
}

export default Adminpage

import React from 'react';
import './Homepage.css'
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
<<<<<<< HEAD

  const navigate = useNavigate()

=======
    const navigate=useNavigate();
>>>>>>> 9c953a321ca48d1a54e90ace8e4b733354d98c61
    const username = localStorage.getItem('username')

  return (
    <div className='home-container'>
      <header className='homepage-header'>
        <div className='marquee'>Welcome to <span className='name'>TrustAssure!</span></div>
        <div className='head-name'>
            Hai {username} Nisha!
        </div>
      </header>
      <div className='homepage-section'>
        <h1 className='section-header'>INSURING YOUR TRUST</h1>
        <p className='section-text mt-3' >Protecting what matters most, because your future deserves security.</p>
<<<<<<< HEAD
        <button className='section-btn mt-3' onClick={()=>{navigate('/home')}}>Get a Quote</button>
=======
        <button onClick={()=>navigate('/home')} className='section-btn mt-3'>Get a Quote</button>
>>>>>>> 9c953a321ca48d1a54e90ace8e4b733354d98c61
      </div>
    </div>
  )
}

export default Homepage

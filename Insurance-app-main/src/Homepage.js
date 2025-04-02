import React from 'react';
import './Homepage.css'
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate=useNavigate();
    const username = localStorage.getItem('username')

  return (
    <div className='home-container'>
      <header className='homepage-header'>
        <div className='marquee'>Welcome to <span className='name'>TrustAssure!</span></div>
        <div className='head-name'>
            Hai {username}!
        </div>
      </header>
      <div className='homepage-section'>
        <h1 className='section-header'>INSURING YOUR TRUST</h1>
        <p className='section-text mt-3' >Protecting what matters most, because your future deserves security.</p>
        <button onClick={()=>navigate('/home')} className='section-btn mt-3'>Get a Quote</button>
      </div>
    </div>
  )
}

export default Homepage

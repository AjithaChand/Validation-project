import React from 'react';
import './Homepage.css'

const Homepage = () => {
  return (
    <div className='home-container'>
      <header className='homepage-header'>
        <div className='marquee'>Welcome to <span className='name'>TrustAssure!</span></div>
      </header>
      <div className='homepage-section'>
        <h1 className='section-header'>INSURING YOUR TRUST</h1>
        <p className='section-text ms-3 mt-4' >Secure the Future, Protect Whats Important</p>
        <button className='section-btn'>Get Started</button>
      </div>
    </div>
  )
}

export default Homepage

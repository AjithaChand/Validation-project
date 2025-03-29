import React from 'react';
import './Homepage.css'

const Homepage = () => {
  return (
    <div className='home-container'>
      <header className='homepage-header'>
        <marquee behavior="scroll">Welcome to <span className='name'>TrustAssure!</span></marquee>
      </header>
    </div>
  )
}

export default Homepage

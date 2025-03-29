import React from 'react';
import './Homepage.css'

const Homepage = () => {
  return (
    <div className='home-container'>
      <header className='homepage-header'>
        <div className='marquee'>Welcome to <span className='name'>TrustAssure!</span></div>
      </header>
      <section>
        <h1 className='section-header'>INSURING YOUR TRUST</h1>
        <p className='section-'>Secure the Future, Protect Whats Important</p>
        <button>Get Started</button>
      </section>
    </div>
  )
}

export default Homepage

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Pets', path: '/pets' },
    { name: 'Vaccinations', path: '/vaccinations' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Products', path: '/products' },
    { name: 'Adoption', path: '/adoption' },
    { name: 'Health Tips', path: '/health-tips' },
    { name: 'AI Assistant', path: '/ai-assistant' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🐾 Petly
        </Link>
        
        <button 
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

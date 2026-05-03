import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import './Header.css'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <nav>
        <Link className="nav-brand" to="/home">Gilded</Link>

        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          <li><Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
          <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
          <li><Link to="/booking" onClick={() => setMenuOpen(false)}>Book Now</Link></li>
          <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link></li>
          <li><Link to="/account" onClick={() => setMenuOpen(false)}>Account</Link></li>
        </ul>
      </nav>
      <button
        type="button"
        className={`nav-backdrop${menuOpen ? ' open' : ''}`}
        aria-label="Close navigation menu"
        onClick={() => setMenuOpen(false)}
      />
    </>
  )
}
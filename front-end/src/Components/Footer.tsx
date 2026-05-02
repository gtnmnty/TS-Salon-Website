import { Link, useLocation } from 'react-router'
import './Footer.css'

export function Footer() {
  const location = useLocation();

  return (
    <>
      <footer>
        <div className="footer-brand">
          <h2>GILDED</h2>
          <p>Cosmetics and Studio</p>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about-us#au-contact-section">Contact Us</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/about-us#testimonials">Reviews</Link></li>
              <li><Link to="/auth" state={{from: location.pathname}} target="_blank">Log in / Sign Up</Link></li>
            </ul>
          </div>

          {/* Customer Area */}
          <div className="footer-col customer-area">
            <h5>Customer Area</h5>
            <ul>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><a href="/help#warranty" target='_blank'>Warranty and Return Policy</a></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/help#privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h5>Contact &amp; Support</h5>
            <ul>
              <li>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Address: 35G Liberty Avenue, Cubao, Quezon City</span>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>gildedsupport@gilded.com.ph | 0927-014-1681</span>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="contact-icon">🕐</span>
                  <span>Mon–Sun: 10:00 AM – 7:00 PM</span>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="contact-icon">🚚</span>
                  <span>Nationwide Shipping (Luzon, Visayas &amp; Mindanao)</span>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="contact-icon">📌</span>
                  <span>Multiple branches nationwide</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-subscribe">
            <h5>Stay Updated</h5>
            <p>Subscribe for beauty news and email promotions.</p>
            <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          Copyright &copy; 2026 – Gilded Cosmetics and Studio
        </div>
      </footer>
    </>
  )
}

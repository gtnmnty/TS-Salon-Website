import { Link, useLocation } from 'react-router'
import './Footer.css'

// ── Payment Badge SVGs ──────────────────────────────────────────
const VisaSVG = () => (
  <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="22" rx="3" fill="none"/>
    <text x="4" y="15" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
    {/* white version for dark bg */}
    <text x="4" y="15" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="rgba(255,255,255,0.75)" letterSpacing="-0.5">VISA</text>
  </svg>
)

const MastercardSVG = () => (
  <svg width="28" height="18" viewBox="0 0 28 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="9" r="8" fill="#EB001B" opacity="0.85"/>
    <circle cx="18" cy="9" r="8" fill="#F79E1B" opacity="0.85"/>
    <path d="M14 3.2a8 8 0 0 1 0 11.6A8 8 0 0 1 14 3.2z" fill="#FF5F00" opacity="0.7"/>
  </svg>
)

const PayPalSVG = () => (
  <svg width="52" height="14" viewBox="0 0 52 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="11" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#009CDE">Pay</text>
    <text x="18" y="11" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#003087">Pal</text>
  </svg>
)

const MayaSVG = () => (
  <svg width="38" height="16" viewBox="0 0 38 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="2" width="14" height="12" rx="2" fill="#00C2B2" opacity="0.9"/>
    <rect x="16" y="2" width="14" height="12" rx="2" fill="#5B4FCF" opacity="0.9"/>
    <text x="1.5" y="12" fontFamily="Arial" fontSize="8.5" fontWeight="800" fill="white">M</text>
    <text x="17.5" y="12" fontFamily="Arial" fontSize="8.5" fontWeight="800" fill="white">a</text>
  </svg>
)

const AmexSVG = () => (
  <svg width="34" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="20" rx="3" fill="#2E77BC" opacity="0.18"/>
    <text x="3" y="13.5" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="800" fill="rgba(100,180,255,0.9)" letterSpacing="0.5">AMEX</text>
  </svg>
)

const GCashSVG = () => (
  <svg width="42" height="16" viewBox="0 0 42 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" fill="#007DFF" opacity="0.9"/>
    <text x="2" y="11.5" fontFamily="Arial" fontSize="8" fontWeight="900" fill="white">G</text>
    <text x="17" y="11.5" fontFamily="Arial" fontSize="8.5" fontWeight="700" fill="rgba(255,255,255,0.7)">Cash</text>
  </svg>
)

const CODSVG = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="rgba(197,160,89,0.7)" strokeWidth="1.2"/>
    <circle cx="8" cy="8" r="2.5" stroke="rgba(197,160,89,0.7)" strokeWidth="1.2"/>
    <line x1="1" y1="6" x2="15" y2="6" stroke="rgba(197,160,89,0.4)" strokeWidth="0.8"/>
    <line x1="1" y1="10" x2="15" y2="10" stroke="rgba(197,160,89,0.4)" strokeWidth="0.8"/>
  </svg>
)

// ── Social Icon SVGs ────────────────────────────────────────────
const InstagramSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
)

const TikTokSVG = () => (
  <svg width="15" height="16" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11.5V18a3 3 0 1 0 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11.5V4h4s.5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FacebookSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Component ───────────────────────────────────────────────────
export function Footer() {
  const location = useLocation()

  return (
    <footer className="gilded-footer">

      {/* Brand */}
      <div className="gf-brand">
        <h2>GILDED</h2>
        <p>Cosmetics and Studio</p>
        <div className="gf-brand-rule">
          <span /><i /><span />
        </div>

        {/* Social Icons */}
        <div className="gf-socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="gf-social-icon" aria-label="Instagram">
            <InstagramSVG />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="gf-social-icon" aria-label="TikTok">
            <TikTokSVG />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="gf-social-icon" aria-label="Facebook">
            <FacebookSVG />
          </a>
        </div>
      </div>

      {/* Payment Badges */}
      <div className="gf-payment">
        <span className="gf-payment-label">Accepted Payment Methods</span>
        <div className="gf-payment-badges">

          <div className="gf-badge">
            <VisaSVG />
            <span className="gf-badge-label">Visa</span>
          </div>

          <div className="gf-badge">
            <MastercardSVG />
            <span className="gf-badge-label">Mastercard</span>
          </div>

          <div className="gf-badge">
            <PayPalSVG />
            <span className="gf-badge-label">PayPal</span>
          </div>

          <div className="gf-badge">
            <MayaSVG />
            <span className="gf-badge-label">Maya</span>
          </div>

          <div className="gf-badge">
            <AmexSVG />
            <span className="gf-badge-label">Amex</span>
          </div>

          <div className="gf-badge">
            <GCashSVG />
            <span className="gf-badge-label">GCash</span>
          </div>

          <div className="gf-badge gf-badge-cod">
            <CODSVG />
            <span className="gf-badge-label">Cash on Delivery</span>
          </div>

        </div>
      </div>

      {/* Main Grid */}
      <div className="gf-grid">

        {/* Quick Links */}
        <div className="gf-col">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about-us#au-contact-section">Contact Us</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/about-us#testimonials">Reviews</Link></li>
            <li><Link to="/auth" state={{ from: location.pathname }} target="_blank">Log in / Sign Up</Link></li>
          </ul>
        </div>

        {/* Customer Area */}
        <div className="gf-col">
          <h5>Customer Area</h5>
          <ul>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><a href="/help#warranty" target="_blank" rel="noreferrer">Warranty and Return Policy</a></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/help#privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div className="gf-col">
          <h5>Contact &amp; Support</h5>
          <ul>
            <li>
              <div className="gf-contact-item">
                <span className="gf-contact-icon">📍</span>
                <span>35G Liberty Avenue, Cubao, Quezon City</span>
              </div>
            </li>
            <li>
              <div className="gf-contact-item">
                <span className="gf-contact-icon">✉️</span>
                <span>gildedsupport@gilded.com.ph<br />0927-014-1681</span>
              </div>
            </li>
            <li>
              <div className="gf-contact-item">
                <span className="gf-contact-icon">🕐</span>
                <span>Mon–Sun: 10:00 AM – 7:00 PM</span>
              </div>
            </li>
            <li>
              <div className="gf-contact-item">
                <span className="gf-contact-icon">🚚</span>
                <span>Nationwide Shipping (Luzon, Visayas &amp; Mindanao)</span>
              </div>
            </li>
            <li>
              <div className="gf-contact-item">
                <span className="gf-contact-icon">📌</span>
                <span>Multiple branches nationwide</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Stay Updated */}
        <div className="gf-col gf-subscribe">
          <h5>Stay Updated</h5>
          <p>Subscribe for beauty news and email promotions.</p>
          <form className="gf-subscribe-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="gf-bottom">
        Copyright &copy; 2026 – Gilded Cosmetics and Studio. All rights reserved.
      </div>

    </footer>
  )
}

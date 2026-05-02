import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import './HelpSupport.css'

export function HelpSupport() {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); }, 3000)
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => e.target.classList.toggle('active', e.isIntersecting))
    }, { threshold: 0.1 })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect();
  }, [])

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [])

  const navigate = useNavigate();

  return (
    <div className="hs-page">
      <title>GILDED - HELP & SUPPORT</title>
      <Header />

      {/* HERO */}
      <section className="page-hero">
        <h1>Help <span>&amp; Support</span></h1>
        <p>We're here to help you with any questions or concerns</p>
        <div className="hero-line"></div>
      </section>

      {/* NEED IMMEDIATE ASSISTANCE */}
      <section className="nim-section">
        <div className="container">
          <h2 className="section-title reveal">Need Immediate Assistance?</h2>
          <div className="contact-grid">
            <div className="contact-card reveal">
              <div className="icon-box"><i className="fa-regular fa-envelope"></i></div>
              <p className="contact-type">Email</p>
              <p className="contact-info">support@glamoursalon.com</p>
              <p className="contact-desc">Response within an hour</p>
            </div>
            <div className="contact-card reveal">
              <div className="icon-box"><i className="fa-solid fa-phone-flip"></i></div>
              <p className="contact-type">Call Us</p>
              <p className="contact-info">+1 (555) 123-4567</p>
              <p className="contact-desc">Mon-Sat: 8AM - 8PM</p>
            </div>
            <div className="contact-card reveal">
              <div className="icon-box"><i className="fa-regular fa-comments"></i></div>
              <p className="contact-type">Live Chat</p>
              <p className="contact-info">Chat with our team</p>
              <p className="contact-desc">Mon-Sat: 9AM - 5PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ OVERVIEW */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title reveal">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item reveal" onClick={() => navigate('/faqs?cat=services-pricing')}>Service & Pricing</div>
            <div className="faq-item reveal" onClick={() => navigate('/faqs?cat=appointments-booking')}>Booking & Appointments</div>
            <div className="faq-item reveal" onClick={() => navigate('/faqs?cat=products-aftercare')}>Product Care</div>
            <div className="faq-item reveal" onClick={() => navigate('/faqs')}>Special Request</div>
          </div>
        </div>
      </section>

      {/* POLICY CARDS */}
      <section id="policy" className="policy-section">
        <div className="container">
          <div className="policy-card reveal">
            <p className="policy-title warranty" id="warranty">Warranty and Return Policy</p>
            <p>We take pride in our workmanship and product quality. If a service result or retail item does not meet our
              standards, please let us know within 7 days. Our team will assess and, when appropriate, provide a corrective
              service or a store credit for eligible items, ensuring your experience remains seamless and luxurious.</p>
          </div>
          <div className="policy-card reveal">
            <p className="policy-title policy">Privacy Policy</p>
            <p>Your trust is essential to us. We collect only the information needed to provide appointments, personalized
              recommendations, and client support. All data is handled with discretion, stored securely, and never shared
              without consent—so your beauty journey with Gilded remains private and protected.</p>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="form-section">
        <div className="form-container reveal">
          <h2 className="section-title">Still Have Questions?</h2>
          <p className="form-intro">Send us a message and we'll get back to you as soon as possible.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="Jane Doe" required />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="jane@example.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Contact No.</label>
                <input type="tel" placeholder="+1 000 000 0000" />
              </div>
              <div className="input-group">
                <label>Subject</label>
                <input type="text" placeholder="Inquiry about..." />
              </div>
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea rows={10} placeholder="How can we help you today?" />
            </div>
            <button type="submit" className="submit-btn" disabled={sending}>
              {sending ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>
      </section>

      {/* VISIT US */}
      <section className="visit-section">
        <div className="container">
          <div className="visit-card reveal">
            <p className="section-title">Visit Our Salon</p>
            <div className="visit-flex">
              <div className="visit-info">
                <div className="detail-block">
                  <p className="info">Address</p>
                  <p>123 Beauty Boulevard, Suite 456<br />New York, NY 10001</p>
                </div>
                <div className="detail-block">
                  <p className="info">Business Hours</p>
                  <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: 10:00 AM - 5:00 PM</p>
                </div>
                <div className="detail-block">
                  <p className="info">Parking</p>
                  <p>Free parking available in the rear lot. Street parking also available.</p>
                </div>
              </div>
              <div className="map-box">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617543064975!2d-73.985428!3d40.748441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Salon Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
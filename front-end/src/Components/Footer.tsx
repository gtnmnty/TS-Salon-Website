import './Footer.css'

export function Footer() {
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
                            <li><a href="#">Services</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Reviews</a></li>
                            <li><a href="#">Log in / Sign Up</a></li>
                        </ul>
                    </div>

                    {/* Customer Area */}
                    <div className="footer-col">
                        <h5>Customer Area</h5>
                        <ul>
                            <li><a href="#">My Account</a></li>
                            <li><a href="#">Orders</a></li>
                            <li><a href="#">Cart</a></li>
                            <li><a href="#">Shipping</a></li>
                            <li><a href="#">Warranty and Return Policy</a></li>
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Privacy Policy</a></li>
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
                </div>

                <div className="footer-bottom">
                    Copyright &copy; 2026 – Gilded Cosmetics and Studio
                </div>
            </footer>
        </>
    )
}
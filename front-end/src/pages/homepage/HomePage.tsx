import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import './HomePage.css'

export function HomePage() {
  return (
    <div className="hp-page">
      <title>GILDED - Homepage</title>

      <Header />

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-left">
          <div className="hero-logo">
            GILDED
            <span>Cosmetics &amp; Studio</span>
          </div>
          <p className="hero-tagline">
            Where luxury meets artistry. Experience the finest in cosmetics, skincare, and beauty services crafted just for
            you.
          </p>
          <div className="hero-actions">
            <div className="hero-btns">
              <a href="services.html" className="btn btn-outline-blush">Explore Services &rarr;</a>
              <a href="products.html" className="btn btn-outline-blush">Shop Products</a>
            </div>
            <a href="booking.html" className="btn btn-dark">Book Now</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-circle" aria-hidden="true">
            <img src="hero-pic.png" alt="hero-pic" />
          </div>

          <div className="rating-badge">
            <span className="star" aria-hidden="true">&#9733;</span>
            <div className="rating-text">
              <strong>5.0 Rating</strong>
              <small>500+ Reviews</small>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── */}
      <section className="section-offer">
        <p className="section-label reveal">Our Specialties</p>
        <h2 className="section-title reveal">What We Offer</h2>

        <div className="offer-grid">
          <div className="offer-card reveal reveal-delay-1">
            <div className="offer-img">
              <div className="placeholder-icon">💆</div>
            </div>
            <div className="offer-info">
              <h4>Facial Treatments</h4>
              <p>Your special day deserves flawless elegance and radiant skin care.</p>
              <div className="offer-footer">
                <span className="offer-price">₱7,350.85</span>
                <a href="#" className="offer-more">More →</a>
              </div>
            </div>
          </div>
          <div className="offer-card reveal reveal-delay-2">
            <div className="offer-img">
              <div className="placeholder-icon">💇</div>
            </div>
            <div className="offer-info">
              <h4>Hair Styling</h4>
              <p>Your special day deserves flawless elegance and expert styling.</p>
              <div className="offer-footer">
                <span className="offer-price">₱7,350.85</span>
                <a href="#" className="offer-more">More →</a>
              </div>
            </div>
          </div>
          <div className="offer-card reveal reveal-delay-3">
            <div className="offer-img">
              <div className="placeholder-icon">💅</div>
            </div>
            <div className="offer-info">
              <h4>Nail Artistry</h4>
              <p>Your special day deserves flawless elegance and creative nail art.</p>
              <div className="offer-footer">
                <span className="offer-price">₱7,350.85</span>
                <a href="#" className="offer-more">More →</a>
              </div>
            </div>
          </div>
          <div className="offer-card reveal reveal-delay-4">
            <div className="offer-img">
              <div className="placeholder-icon">✨</div>
            </div>
            <div className="offer-info">
              <h4>Bridal Packages</h4>
              <p>Your special day deserves flawless elegance and timeless beauty.</p>
              <div className="offer-footer">
                <span className="offer-price">₱7,350.85</span>
                <a href="#" className="offer-more">More →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section-products">
        <p className="section-label reveal">Shop the Collection</p>
        <h2 className="section-title reveal">Featured Products</h2>

        <div className="product-grid">
          <div className="product-card reveal reveal-delay-1">
            <span className="bestseller-tag">Best Seller</span>
            <div className="product-img">
              <div className="placeholder-icon">🧴</div>
            </div>
            <div className="product-footer">
              <div>
                <div className="product-name">Glow Serum</div>
                <div className="product-price">₱3,947.40</div>
              </div>
              <div className="product-actions">
                <button className="btn-cart">Add to Cart</button>
                <button className="btn-buy">Buy</button>
              </div>
            </div>
          </div>
          <div className="product-card reveal reveal-delay-2">
            <span className="bestseller-tag">Best Seller</span>
            <div className="product-img">
              <div className="placeholder-icon">💄</div>
            </div>
            <div className="product-footer">
              <div>
                <div className="product-name">Velvet Rouge</div>
                <div className="product-price">₱3,947.40</div>
              </div>
              <div className="product-actions">
                <button className="btn-cart">Add to Cart</button>
                <button className="btn-buy">Buy</button>
              </div>
            </div>
          </div>
          <div className="product-card reveal reveal-delay-3">
            <span className="bestseller-tag">Best Seller</span>
            <div className="product-img">
              <div className="placeholder-icon">🌸</div>
            </div>
            <div className="product-footer">
              <div>
                <div className="product-name">Rose Mist Toner</div>
                <div className="product-price">₱3,947.40</div>
              </div>
              <div className="product-actions">
                <button className="btn-cart">Add to Cart</button>
                <button className="btn-buy">Buy</button>
              </div>
            </div>
          </div>
        </div>

        <div className="view-all-wrap reveal">
          <a href="#" className="btn-view-all">View All Products</a>
        </div>
      </section>

      <section className="section-story">
        <div className="story-gallery reveal">
          <div className="gallery-placeholder">
            <span>Image 1</span>
            <div className="gallery-nav">
              <button className="gallery-dot" aria-label="Previous"></button>
              <button className="gallery-dot" aria-label="Next"></button>
            </div>
          </div>
        </div>

        <div className="story-content reveal reveal-delay-2">
          <p className="section-label">Our Philosophy</p>
          <h2 className="story-title">The Art of Beauty</h2>
          <p className="story-body">
            At GILDED, we believe that beauty is an art form. Our team of expert artists and stylists are dedicated to
            bringing out your unique radiance through personalized treatments and premium products.
          </p>
          <p className="story-body">
            Founded with a passion for excellence, we've been transforming our clients' beauty experiences for over a
            decade. Every service is crafted with precision, care, and the finest ingredients.
          </p>

          <div className="story-stats">
            <div className="stat-item">
              <div className="stat-num">10<sup>+</sup></div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">5K<sup>+</sup></div>
              <div className="stat-label">Satisfied Clients</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">17<sup>+</sup></div>
              <div className="stat-label">Expert Artists</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
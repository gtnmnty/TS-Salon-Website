import { useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { products } from '../../../../backend/data/products'
import './HomePage.css'

const offerItems = [
  {
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop',
    title: 'Facial Treatments',
    desc: 'Your special day deserves flawless elegance and radiant skin care.',
    price: '₱7,350.85',
  },
  {
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop',
    title: 'Hair Styling',
    desc: 'Your special day deserves flawless elegance and expert styling.',
    price: '₱7,350.85',
  },
  {
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop',
    title: 'Nail Artistry',
    desc: 'Your special day deserves flawless elegance and creative nail art.',
    price: '₱7,350.85',
  },
  {
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&auto=format&fit=crop',
    title: 'Bridal Packages',
    desc: 'Your special day deserves flawless elegance and timeless beauty.',
    price: '₱7,350.85',
  },
]

const galleryImgs = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&auto=format&fit=crop',
]

export function HomePage() {
  const [galleryIdx, setGalleryIdx] = useState(0)

  useEffect(() => {
    const els = document.querySelectorAll('.hp-page .reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const featured = products.filter((p) => p.badge).slice(0, 3)

  const prevImg = () => setGalleryIdx((i) => (i - 1 + galleryImgs.length) % galleryImgs.length)
  const nextImg = () => setGalleryIdx((i) => (i + 1) % galleryImgs.length)

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
            Where luxury meets artistry. Experience the finest in cosmetics, skincare, and beauty services crafted just
            for you.
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
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop" alt="hero-pic" />
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
          {offerItems.map((item, i) => (
            <div key={item.title} className={`offer-card reveal reveal-delay-${i + 1}`}>
              <div className="offer-img">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="offer-info">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <div className="offer-footer">
                  <span className="offer-price">{item.price}</span>
                  <a href="#" className="offer-more">More →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section-products">
        <p className="section-label reveal">Shop the Collection</p>
        <h2 className="section-title reveal">Featured Products</h2>

        <div className="product-grid">
          {featured.map((product, i) => (
            <div key={product.id} className={`product-card reveal reveal-delay-${i + 1}`}>
              {product.badge && <span className="bestseller-tag">{product.badge}</span>}
              <div className="product-img">
                <img src={product.imgs[0]} alt={product.name} />
              </div>
              <div className="product-footer">
                <div className="product-name">{product.name}</div>
                <div className="product-meta">
                  <div className="product-price">{product.price}</div>
                  <div className="product-actions">
                    <button className="btn-cart">Add to Cart</button>
                    <button className="btn-buy">Buy</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-wrap reveal">
          <a href="#" className="btn-view-all">View All Products</a>
        </div>
      </section>

      {/* ── THE ART OF BEAUTY ── */}
      <section className="section-story">
        <div className="story-gallery reveal">
          <img
            className="gallery-main"
            src={galleryImgs[galleryIdx]}
            alt={`Gallery image ${galleryIdx + 1}`}
          />
          <button className="gallery-btn gallery-btn--prev" onClick={prevImg} aria-label="Previous image">
            &#8592;
          </button>
          <button className="gallery-btn gallery-btn--next" onClick={nextImg} aria-label="Next image">
            &#8594;
          </button>
          <div className="gallery-dots">
            {galleryImgs.map((_, i) => (
              <button
                key={i}
                className={`gallery-pip${i === galleryIdx ? ' active' : ''}`}
                onClick={() => setGalleryIdx(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
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

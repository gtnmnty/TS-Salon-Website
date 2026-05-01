import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { ServiceItem } from '../../../../backend/types/services.ts'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ServiceOverlay } from './ServiceOverlay'
import { services } from '../../../../backend/data/services'
import './Service.css'
import './ServiceOverlay.css'

const CATEGORIES = ['All', 'Hair Care', 'Skin Care', 'Nail Care', 'Make Up']

function ServiceCard({ service, onOpen }: { service: ServiceItem; onOpen: (s: ServiceItem) => void }) {
  const navigate = useNavigate()
  
  return (
    <div className="card" onClick={() => onOpen(service)}>
      <div className="card-img" style={{ backgroundImage: `url('${service.imgs[0]}')` }}>
        {service.badge && <span className="card-badge">{service.badge}</span>}
      </div>
      <div className="card-content">
        <div className="card-brand">{service.category}</div>
        <div className="card-name">{service.name}</div>
        <div className="card-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-count">{service.reviewCount} reviews</span>
        </div>
        <div className="card-footer">
          <span className="card-price">{service.price}</span>
          <div className="card-actions">
            <button className="book-btn" type="button" onClick={() => navigate('/booking', { state: { service: service.name } })}>
              Book
            </button>
            <button className="cart-btn" type="button" onClick={e => { e.stopPropagation(); onOpen(service); }}>
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Services() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const navigate = useNavigate()

  const filtered = services
    .filter(s => activeCategory === 'All' || s.category === activeCategory)
    .filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'price-asc' ? a.priceNum - b.priceNum :
      sort === 'price-desc' ? b.priceNum - a.priceNum : 0
    )

  const handleBook = (service: ServiceItem) => {
    sessionStorage.setItem('selectedService', service.name)
    sessionStorage.setItem('selectedServiceCategory', service.category)
    navigate('/booking')
  }

  return (
    <div className="services-page">
      <title>GILDED - Services</title>
      <Header />

      {/* HERO */}
      <div className="page-hero">
        <h1>Our <span>Services</span></h1>
        <p>Premium beauty rituals, tailored for you</p>
        <div className="hero-line"></div>
      </div>

      {/* SEARCH */}
      <div className="search-wrap">
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-btn" type="button" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
              <path d="M16.5 16.5L21 21" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="filter-pills">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`pill${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SORT */}
      <div className="container">
        <div className="section-heading">Our Services</div>
        <div className="section-sub">Reserve your next appointment with ease</div>

        <select className="sort-select" id="sortSelect" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        {/* GRID */}
        <div className="item-grid">
          {filtered.length > 0
            ? filtered.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onOpen={setSelectedService}
                />
              ))
            : <p className="no-results">No services found.</p>
          }
        </div>
      </div>

      {/* OVERLAY */}
      <ServiceOverlay
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={handleBook}
      />

      <Footer />
    </div>
  )
}

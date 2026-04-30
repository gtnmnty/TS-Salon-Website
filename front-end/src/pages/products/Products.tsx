import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { ProductItem } from '../../../../backend/types/products.ts'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ProductOverlay } from './ProductOverlay'
import { products } from '../../../../backend/data/products'
import './Products.css'
import './ProductOverlay.css'

const CATEGORIES = ['All', 'Hair Care', 'Skin Care', 'Nail Care', 'Make Up']

const CART_KEY = 'cart'

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') }
  catch { return [] }
}

function saveCart(cart: object[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addItemToCart(product: ProductItem, qty: number) {
  const cart = getCart()
  const id = String(product.id)
  const match = cart.find((i: { id: string }) => i.id === id)
  if (match) {
    (match as { qty: number }).qty += qty
  } else {
    cart.push({
      id,
      name: product.name,
      price: product.priceNum,
      desc: product.desc,
      image: product.imgs[0] || '',
      qty,
      deliveryOptionId: 1,
    })
  }
  saveCart(cart)
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onOpen,
  onToast,
}: {
  product: ProductItem
  onOpen: (p: ProductItem) => void
  onToast: (msg: string) => void
}) {
  const [qty, setQty] = useState(1)

  const dec = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQty(q => Math.max(1, q - 1))
  }

  const inc = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQty(q => Math.min(10, q + 1))
  }

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToast(`Quantity updated to ${qty}.`)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItemToCart(product, qty)
    onToast(`Added ${qty} × ${product.name} to cart ✨`)
  }

  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!product) return
    addItemToCart(product, qty)
    navigate('/checkout')
  }

  return (
    <div className="card" onClick={() => onOpen(product)}>
      <div className="card-img" style={{ backgroundImage: `url('${product.imgs[0]}')` }}>
        {product.badge && <span className="card-badge">{product.badge}</span>}
      </div>
      <div className="card-content">
        <div className="card-brand">{product.brand}</div>
        <div className="card-name">{product.name}</div>
        <div className="card-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-count">{product.reviewCount} reviews</span>
        </div>
        <div className="card-price">{product.price}</div>

        {/* Qty controls */}
        <div className="card-qty-row" onClick={e => e.stopPropagation()}>
          <span className="card-qty-label">Qty</span>
          <div className="card-qty-controls">
            <button className="card-qty-btn" type="button" onClick={dec}>−</button>
            <input className="card-qty-num" type="number" value={qty} min={1} max={10}
              onChange={e => setQty(Math.min(10, Math.max(1, Number(e.target.value))))}
              onClick={e => e.stopPropagation()}
            />
            <button className="card-qty-btn" type="button" onClick={inc}>+</button>
          </div>
          <button className="card-qty-update" type="button" onClick={handleUpdate}>Update</button>
        </div>

        <div className="card-actions">
          <button className="add-to-cart-btn" type="button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="buy-btn btn-secondary" onClick={() => { handleBuyNow(); navigate('/checkout') }}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Products Page ────────────────────────────────────────────────────────────

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const navigate = useNavigate()

  const showToast = (msg: string) => {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'price-asc' ? a.priceNum - b.priceNum :
        sort === 'price-desc' ? b.priceNum - a.priceNum : 0
    )

  const handleBuyNow = (product: ProductItem, qty: number) => {
    addItemToCart(product, qty)
    navigate('/checkout')
  }

  return (
    <div className="products-page">
      <title>GILDED - Products</title>
      <Header />

      {/* HERO */}
      <div className="page-hero">
        <h1>Our <span>Products</span></h1>
        <p>Premium beauty essentials, curated for you</p>
        <div className="hero-line"></div>
      </div>

      {/* SEARCH */}
      <div className="search-wrap">
        <div className="search-box">
          <input
            className="search-input"
            id="searchInput"
            type="text"
            placeholder="Search products…"
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
      <div className="sort-wrap">
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort by: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* GRID */}
      <div className="container">
        <div className="section-heading">Our Products</div>
        <div className="section-sub">Premium beauty essentials, curated for you</div>


        <div className="items-grid">
          {filtered.length > 0
            ? filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={setSelectedProduct}
                onToast={showToast}
              />
            ))
            : <p className="no-results">No products found.</p>
          }
        </div>
      </div>

      {/* OVERLAY */}
      <ProductOverlay
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
        onToast={showToast}
      />

      {/* TOAST */}
      <div className={`toast product-toast${toastVisible ? ' show' : ''}`}>{toast}</div>

      <Footer />
    </div>
  )
}

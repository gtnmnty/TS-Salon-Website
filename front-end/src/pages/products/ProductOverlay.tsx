import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, type WheelEvent as ReactWheelEvent } from 'react'
import type { ProductItem, Review } from '../../../../backend/types/products.ts'
import { addItemToCart } from './Products'

interface Props {
  product: ProductItem | null
  onClose: () => void
  onBuyNow: (product: ProductItem, qty: number) => void
  onToast: (msg: string) => void
}

function StarPicker({ selected, onSelect }: { selected: number; onSelect: (n: number) => void }) {
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= selected ? 'lit' : ''} onClick={() => onSelect(n)}>★</span>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <div className="review-top">
        <div>
          <div className="reviewer-name">{review.name}</div>
          <div className="review-date">{review.date}</div>
        </div>
        <span className="review-stars">
          {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
        </span>
      </div>
      <p className="review-text">"{review.text}"</p>
    </div>
  )
}

export function ProductOverlay({ product, onClose, onBuyNow, onToast }: Props) {
  const [imgIdx, setImgIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewPerPage, setReviewPerPage] = useState(3)
  const [selectedStars, setSelectedStars] = useState(5)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerDate, setReviewerDate] = useState('')
  const [reviewText, setReviewText] = useState('')

  const reviewsWrapperRef = useRef<HTMLDivElement>(null)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const isDraggingRef = useRef(false)
  const justSubmittedRef = useRef(false)
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset when product changes
  useEffect(() => {
    if (!product) return
    setImgIdx(0)
    setQty(1)
    setReviews(product.reviews)
    setSelectedStars(5)
    setReviewerName('')
    setReviewerDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }))
    setReviewText('')
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [product])

  // Auto-slide
  useEffect(() => {
    if (!product) return
    autoTimerRef.current = setInterval(() => {
      setImgIdx(prev => (prev + 1) % product.imgs.length)
    }, 2500)
    return () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current) }
  }, [product, imgIdx])

  const calcReviewPerPage = () => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return 3
    const w = wrapper.offsetWidth
    if (w <= 580) return 1
    if (w <= 900) return 2
    return 3
  }

  useEffect(() => {
    const update = () => setReviewPerPage(calcReviewPerPage())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const getReviewStep = () => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return 1
    return wrapper.offsetWidth / Math.max(1, reviewPerPage)
  }

  // Keep nav buttons in sync with native scrolling
  useEffect(() => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return
    const syncIndex = () => {
      const step = getReviewStep()
      const maxIndex = Math.max(0, reviews.length - reviewPerPage)
      const nextIndex = Math.min(maxIndex, Math.max(0, Math.round(wrapper.scrollLeft / step)))
      setReviewIndex(nextIndex)
    }
    syncIndex()
    wrapper.addEventListener('scroll', syncIndex, { passive: true })
    return () => wrapper.removeEventListener('scroll', syncIndex)
  }, [reviews.length, reviewPerPage])

  const stopReviewDrag = () => {
    const wrapper = reviewsWrapperRef.current
    isDraggingRef.current = false
    wrapper?.classList.remove('dragging')
  }

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const wrapper = reviewsWrapperRef.current
      if (!wrapper || !isDraggingRef.current) return
      const delta = e.clientX - dragStartXRef.current
      wrapper.scrollLeft = dragStartScrollLeftRef.current - delta
    }

    const handleWindowMouseUp = () => {
      stopReviewDrag()
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [])

  useEffect(() => {
    if (!justSubmittedRef.current) return
    justSubmittedRef.current = false
    requestAnimationFrame(() => {
      const wrapper = reviewsWrapperRef.current
      if (!wrapper) return
      wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: 'smooth' })
    })
  }, [reviews, reviewPerPage])

  const stepImg = (dir: number) => {
    if (!product) return
    setImgIdx(prev => (prev + dir + product.imgs.length) % product.imgs.length)
  }

  const handleAddToCart = () => {
    if (!product) return
    addItemToCart(product, qty)
    onToast(`Added ${qty} × ${product.name} to cart ✨`)
  }

  const handleBuyNow = () => {
    if (!product) return
    onBuyNow(product, qty)
  }

  const handleSubmitReview = () => {
    if (!reviewerName.trim() || !reviewText.trim()) {
      onToast('Please fill in your name and review.')
      return
    }

    const newReview: Review = {
      name: reviewerName.trim(),
      stars: selectedStars,
      date: reviewerDate || 'Just now',
      text: reviewText.trim(),
    }

    setReviews(prev => [...prev, newReview])
    setReviewerName('')
    setReviewerDate('')
    setReviewText('')
    setSelectedStars(5)
    justSubmittedRef.current = true

    onToast('Thank you for your review! ✨')
  }

  if (!product) return null

  const reviewCount = reviews.length
  const canScrollLeft = reviewIndex > 0
  const canScrollRight = reviewIndex < Math.max(0, reviews.length - reviewPerPage)

  const scrollReviews = (dir: number) => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return
    const step = getReviewStep()
    wrapper.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const handleReviewMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    dragStartScrollLeftRef.current = wrapper.scrollLeft
    wrapper.classList.add('dragging')
  }

  const handleReviewWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (delta === 0) return
    e.preventDefault()
    wrapper.scrollLeft += delta * 1.1
  }

  return (
    <div className="overlay product-overlay" style={{ display: 'block' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="overlay-box">

        {/* TOP BAR */}
        <div className="overlay-top-bar">
          <button className="back-btn" onClick={onClose}>← Back to Products</button>
          <span className="overlay-top-title">Product Detail</span>
        </div>

        <div className="overlay-body">

          {/* IMAGE VIEWER */}
          <div className="image-viewer">
            <div
              className="big-img"
              style={{ backgroundImage: `url('${product.imgs[imgIdx]}')` }}
            >
              <span className="img-count-badge">{imgIdx + 1} / {product.imgs.length}</span>
              <button className="img-arrow img-arrow-left" onClick={() => stepImg(-1)} aria-label="Previous image">
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="img-arrow img-arrow-right" onClick={() => stepImg(1)} aria-label="Next image">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="thumbnail-bar">
              {product.imgs.map((img, i) => (
                <div
                  key={i}
                  className={`thumb${i === imgIdx ? ' active' : ''}`}
                  style={{ backgroundImage: `url('${img}')` }}
                  onClick={() => setImgIdx(i)}
                  onMouseEnter={() => setImgIdx(i)}
                />
              ))}
            </div>
          </div>

          {/* INFO PANE */}
          <div className="info-pane">
            <div className="overlay-brand">{product.brand}</div>
            <h2 className="overlay-name">{product.name}</h2>
            <p className="overlay-desc">{product.desc}</p>

            <div className="overlay-rating">
              <span className="stars">★★★★★</span>
              <span>5.0 ({reviewCount * 310 + 88} Reviews)</span>
            </div>

            <div className="overlay-price">{product.price}</div>

            <div className="info-section">
              <h4>Product Highlights</h4>
              <ul className="info-bullets">
                {product.info.map((tag, i) => <li key={i}>{tag}</li>)}
              </ul>
            </div>

            {/* QTY */}
            <div className="qty-row">
              <span className="qty-label">Qty</span>
              <div className="qty-container">
                <button className="qty-update dec-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                <input
                  className="qty-input"
                  type="number"
                  value={qty}
                  min={1}
                  max={10}
                  onChange={e => setQty(Math.min(10, Math.max(1, Number(e.target.value))))}
                />
                <button className="qty-update add-btn" onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
              </div>
              <button className="update-btn save-btn" onClick={() => onToast(`Quantity updated to ${qty}`)}>
                UPDATE
              </button>
            </div>

            {/* ACTIONS */}
            <div className="action-btns">
              <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn-secondary" onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="review-area">
            <div className="review-header">
              <h3>Customer Reviews</h3>
              <span className="review-count-badge">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
            </div>

            <div
              className="reviews-list-wrapper"
              ref={reviewsWrapperRef}
              onMouseDown={handleReviewMouseDown}
              onMouseUp={stopReviewDrag}
              onMouseLeave={stopReviewDrag}
              onWheel={handleReviewWheel}
            >
              <div className="reviews-list">
                {reviews.map((r, i) => <ReviewCard key={`${i}-${r.name}-${r.date}`} review={r} />)}
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="review-nav">
                <button
                  className={`review-nav-btn${canScrollLeft ? '' : ' disabled'}`}
                  onClick={() => scrollReviews(-1)}
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <span className="review-nav-hint">drag or scroll to browse</span>
                <button
                  className={`review-nav-btn${canScrollRight ? '' : ' disabled'}`}
                  onClick={() => scrollReviews(1)}
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            )}

            <div className="add-review">
              <h4>Write a Review</h4>
              <div className="review-form-grid">
                <input
                  type="text"
                  placeholder="Your name"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Today's date (optional)"
                  value={reviewerDate}
                  onChange={e => setReviewerDate(e.target.value)}
                />
              </div>

              <StarPicker selected={selectedStars} onSelect={setSelectedStars} />

              <textarea
                placeholder="What did you love about this product?"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />

              <button className="submit-review-btn" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

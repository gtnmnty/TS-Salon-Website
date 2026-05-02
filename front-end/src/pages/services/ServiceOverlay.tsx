import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, type WheelEvent as ReactWheelEvent } from 'react'
import type { ServiceItem, Review } from '../../../../backend/types/services.ts'
import { useNavigate } from 'react-router'

interface Props {
  service: ServiceItem | null
  onClose: () => void
  onBook: (service: ServiceItem) => void
}

function StarPicker({ selected, onSelect }: { selected: number; onSelect: (n: number) => void }) {
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} data-stars={n} className={n <= selected ? 'lit' : ''} onClick={() => onSelect(n)}>★</span>
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

export function ServiceOverlay({ service, onClose, onBook }: Props) {
  const [imgIdx, setImgIdx] = useState(0)
  const [guests, setGuests] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewCount, setReviewCount] = useState(0)
  const [selectedStars, setSelectedStars] = useState(5)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerDate, setReviewerDate] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewPerPage, setReviewPerPage] = useState(3)

  const reviewsWrapperRef = useRef<HTMLDivElement>(null)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const isDraggingRef = useRef(false)
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const justSubmittedRef = useRef(false)
  const navigate = useNavigate()

  // Reset state when service changes
  useEffect(() => {
    if (!service) return
    setImgIdx(0)
    setGuests(1)
    setReviews(service.reviews)
    setReviewCount(service.reviewCount)
    setSelectedStars(5)
    setReviewText('')

    // autofill name and date from session
    const currentUser = (() => {
      try { return JSON.parse(sessionStorage.getItem('currentUser') ?? 'null') }
      catch { return null }
    })()
    setReviewerName(currentUser?.fullName ?? '')
    setReviewerDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))

    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [service])

  // Auto-slide
  useEffect(() => {
    if (!service) return
    autoTimerRef.current = setInterval(() => {
      setImgIdx(prev => (prev + 1) % service.imgs.length)
    }, 2000)
    return () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current) }
  }, [service, imgIdx])

  // Compute perPage from container width
  const calcReviewPerPage = () => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return 3
    const w = wrapper.offsetWidth
    if (w <= 580) return 1
    if (w <= 900) return 2
    return 3
  }

  // Sync perPage on mount and resize
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

  // When a new review is submitted, jump to show it (last position)
  useEffect(() => {
    if (!justSubmittedRef.current) return
    justSubmittedRef.current = false
    requestAnimationFrame(() => {
      const wrapper = reviewsWrapperRef.current
      if (!wrapper) return
      wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: 'smooth' })
    })
  }, [reviews, reviewPerPage])

  const scrollReviews = (dir: number) => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return
    const step = getReviewStep()
    wrapper.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const canScrollLeft = reviewIndex > 0
  const canScrollRight = reviewIndex < Math.max(0, reviews.length - reviewPerPage)
  const handleReviewMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    dragStartScrollLeftRef.current = wrapper.scrollLeft
    wrapper.classList.add('dragging')
  }

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

  const handleReviewWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    const wrapper = reviewsWrapperRef.current
    if (!wrapper) return
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (delta === 0) return
    e.preventDefault()
    wrapper.scrollLeft += delta * 1.1
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const stepImg = (dir: number) => {
    if (!service) return
    setImgIdx(prev => (prev + dir + service.imgs.length) % service.imgs.length)
  }

  const handleSubmitReview = () => {
    if (!reviewerName.trim() || !reviewText.trim()) {
      showToast('Please fill in your name and review.')
      return
    }

    const newReview: Review = {
      name: reviewerName.trim(),
      stars: selectedStars,
      date: reviewerDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      text: reviewText.trim(),
    }

    setReviews(prev => [...prev, newReview])
    setReviewCount(prev => prev + 1)
    setReviewText('')
    setSelectedStars(5)
    justSubmittedRef.current = true

    showToast('Thank you for your review!')
  }

  if (!service) return null
  

  return (
    <>
      <div className="overlay service-overlay" style={{ display: 'block' }}>
        <div className="overlay-box">

          {/* TOP BAR */}
          <div className="overlay-top-bar">
            <button className="back-btn" onClick={onClose}>← Back to Services</button>
            <span className="overlay-top-title">Service Detail</span>
          </div>

          <div className="overlay-body">

            {/* IMAGE VIEWER */}
            <div className="image-viewer">
              <div className="big-img" style={{ backgroundImage: `url('${service.imgs[imgIdx]}')` }}>
                <span className="img-count-badge">{imgIdx + 1} / {service.imgs.length}</span>
                <button className="img-arrow img-arrow-left" onClick={() => stepImg(-1)} aria-label="Previous image">
                  <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button className="img-arrow img-arrow-right" onClick={() => stepImg(1)} aria-label="Next image">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>

              <div className="thumbnail-bar">
                {service.imgs.map((img, i) => (
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
              <div className="overlay-brand">{service.category}</div>
              <h2 className="overlay-name">{service.name}</h2>
              <p className="overlay-desc">{service.desc}</p>

              <div className="overlay-rating">
                <span className="stars">★★★★★</span>
                <span>5.0 · {reviewCount} Reviews</span>
              </div>

              <div className="overlay-price">{service.price}</div>

              <div className="info-section">
                <h4>Service Highlights</h4>
                <ul className="info-bullets">
                  {service.info.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              {/* GUESTS */}
              <div className="qty-row">
                <span className="qty-label">Guests</span>
                <div className="qty-container">
                  <button className="qty-update dec-btn" onClick={() => setGuests(g => Math.max(1, g - 1))}>-</button>
                  <input
                    className="qty-input"
                    type="number"
                    value={guests}
                    min={1}
                    max={10}
                    onChange={e => setGuests(Math.min(10, Math.max(1, Number(e.target.value))))}
                  />
                  <button className="qty-update add-btn" onClick={() => setGuests(g => Math.min(10, g + 1))}>+</button>
                </div>
                <button className="update-btn save-btn" onClick={() => showToast(`Guests updated to ${guests}`)}>
                  UPDATE
                </button>
              </div>

              <div className="action-btns">
                <button className="overlay-book-btn" onClick={() => navigate('/booking', { state: { service: service.name, guests } })}>
                  Book Now
                </button>
              </div>
            </div>

            {/* REVIEWS */}
            <div className="review-area">
              <div className="review-header">
                <h3>Client Reviews</h3>
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

              {/* SCROLL ARROWS */}
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
                <h4>Share Your Experience</h4>
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
                  placeholder="What did you love about this service?"
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

      <div className={`toast service-toast${toastVisible ? ' show' : ''}`}>{toast}</div>
    </>
  )
}
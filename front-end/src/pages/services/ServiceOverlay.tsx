import { useState, useEffect, useRef } from 'react'
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
        <span key={n} data-stars={n} className={n <= selected ? 'lit' : ''} onClick={() => onSelect(n)}>
          ★
        </span>
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

  const reviewsListRef = useRef<HTMLDivElement>(null)
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const navigate = useNavigate();

  // Reset state when service changes
  useEffect(() => {
    if (!service) return
    setImgIdx(0)
    setGuests(1)
    setReviews(service.reviews)
    setReviewCount(service.reviewCount)
    setSelectedStars(5)
    setReviewerName('')
    setReviewText('')
    setReviewerDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }))
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


  // Reviews swipe — mouse drag
  useEffect(() => {
    const el = reviewsListRef.current
    if (!el) return

    let isDown = false, startX = 0, scrollLeft = 0

    const onMouseDown = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
      el.style.cursor = 'grabbing'
    }
    const onMouseLeave = () => { isDown = false; el.style.cursor = 'grab' }
    const onMouseUp = () => { isDown = false; el.style.cursor = 'grab' }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4
    }
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY * 1.2
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('wheel', onWheel)
    }
  }, [service])

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
      date: reviewerDate || 'Just now',
      text: reviewText.trim(),
    }

    setReviews(prev => [...prev, newReview])
    setReviewCount(prev => prev + 1)
    setReviewerName('')
    setReviewerDate('')
    setReviewText('')
    setSelectedStars(5)

    setTimeout(() => {
      reviewsListRef.current?.scrollTo({ left: reviewsListRef.current.scrollWidth, behavior: 'smooth' })
    }, 50)

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
              <div
                className="big-img"
                style={{ backgroundImage: `url('${service.imgs[imgIdx]}')` }}
              >
                <span className="img-count-badge">{imgIdx + 1} / {service.imgs.length}</span>

                <button className="img-arrow img-arrow-left" onClick={() => stepImg(-1)} aria-label="Previous image">
                  <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button className="img-arrow img-arrow-right" onClick={() => stepImg(1)} aria-label="Next image">
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>

              {/* THUMBNAILS */}
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
                <button className="overlay-book-btn" onClick={() => navigate('/booking', { state: { service: service.name } })}>
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

              <div className="reviews-list" ref={reviewsListRef}>
                {reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
              </div>

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

      {/* TOAST */}
      <div className={`toast service-toast${toastVisible ? ' show' : ''}`}>{toast}</div>
    </>
  )
}

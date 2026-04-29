import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import './Service.css'

export function Services() {
    return (
        <>
            <title>GILDED - SERVICES</title>

            <Header />

            <div className="page-hero">
                <h1>Our <span>Services</span></h1>
                <p>Premium beauty rituals, tailored for you</p>
                <div className="hero-line"></div>
            </div>

            <div className="search-wrap">
                <div className="search-box">
                    <input className="search-input" id="searchInput" type="text" placeholder="Search services..." />
                    <button className="search-btn" type="button" aria-label="Search">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                            <path d="M16.5 16.5L21 21" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="filter-pills">
                <button className="pill active" data-category="all">All</button>
                <button className="pill" data-category="Hair Care">Hair Care</button>
                <button className="pill" data-category="Skin Care">Skin Care</button>
                <button className="pill" data-category="Nail Care">Nail Care</button>
                <button className="pill" data-category="Make Up">Make Up</button>
            </div>

            <div className="container">
                <div className="section-heading">Our Services</div>
                <div className="section-sub">Reserve your next appointment with ease</div>
                <div className="item-grid" id="services-grid"></div>
            </div>

            <div className="overlay" id="detailOverlay">
                <div className="overlay-box">
                    <div className="overlay-top-bar">
                        <button className="back-btn" id="backBtn">&larr; Back to Services</button>
                        <span className="overlay-top-title">Service Detail</span>
                    </div>
                    <div className="overlay-body">
                        <div className="image-viewer">
                            <div className="big-img" id="mainDetailImg">
                                <span className="img-count-badge" id="imgCountBadge">1 / 4</span>
                            </div>
                            <div className="thumbnail-bar" id="thumbBar"></div>
                        </div>
                        <div className="info-pane">
                            <div className="overlay-brand" id="itemBrand">Category</div>
                            <h2 className="overlay-name" id="itemName">Service Name</h2>
                            <p className="overlay-desc" id="itemDesc"></p>
                            <div className="overlay-rating">
                                <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                                <span id="ratingInfo">5.0 (Reviews)</span>
                            </div>
                            <div className="overlay-price" id="itemPrice">PHP 0</div>
                            <div className="info-section">
                                <h4>Service Highlights</h4>
                                <div className="info-tags" id="infoTags"></div>
                            </div>
                            <div className="qty-row">
                                <span className="qty-label">Guests</span>
                                <div className="qty-container">
                                    <button className="qty-update dec-btn">-</button>
                                    <input type="number" className="qty-input" id="qtyInput" defaultValue={1} min={1} max={10} />
                                    <button className="qty-update add-btn">+</button>
                                </div>
                                <button className="update-btn save-btn">UPDATE</button>
                            </div>
                            <div className="action-btns">
                                <button className="overlay-book-btn" id="bookNowBtn">Book Now</button>
                            </div>
                        </div>
                        <div className="review-area">
                            <div className="review-header">
                                <h3>Client Reviews</h3>
                                <span className="review-count-badge" id="reviewCountBadge">Showing top reviews</span>
                            </div>
                            <div className="reviews-list" id="reviewsList"></div>
                            <div className="add-review">
                                <h4>Share Your Experience</h4>
                                <div className="review-form-grid">
                                    <input type="text" id="reviewerName" placeholder="Your name" />
                                    <input type="text" id="reviewerDate" placeholder="Today's date (optional)" />
                                </div>
                                <div className="star-picker" id="starPicker">
                                    <span data-stars="1">&#9733;</span>
                                    <span data-stars="2">&#9733;</span>
                                    <span data-stars="3">&#9733;</span>
                                    <span data-stars="4">&#9733;</span>
                                    <span data-stars="5">&#9733;</span>
                                </div>
                                <textarea id="reviewText" placeholder="What did you love about this service?"></textarea>
                                <button className="submit-review-btn" id="submitReviewBtn">Submit Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="toast" id="toast"></div>

            <Footer />
        </>
    )
}
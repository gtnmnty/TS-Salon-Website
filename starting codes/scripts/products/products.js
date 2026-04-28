import { ProductOverlay } from './product-overlay.js';

const products = [
  {
    id: 1,
    name: "Repair & Restore Shampoo",
    brand: "Lumière Essentials",
    category: "Hair Care",
    price: "₱680",
    priceNum: 679.99,
    badge: "Best Seller",
    desc: "Protein-rich formula that rebuilds broken bonds and restores silky softness to damaged hair.",
    imgs: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&auto=format&fit=crop"
    ],
    info: ["Keratin-Infused", "Sulfate-Free", "Color Safe", "300ml"],
    reviewCount: 1024,
    reviews: [
      { name: "Anika R.", stars: 5, date: "Mar 2025", text: "My hair is noticeably softer after just one wash. This is now a staple in my routine." },
      { name: "Diane L.", stars: 5, date: "Feb 2025", text: "Finally a shampoo that actually delivers on its promises. My split ends are much better." },
      { name: "Ysa M.",   stars: 4, date: "Jan 2025", text: "Lovely scent and very gentle. My color-treated hair loves it." }
    ]
  },
  {
    id: 2,
    name: "Rose Gold Serum",
    brand: "Lumière Skin",
    category: "Skin Care",
    price: "₱1,450",
    priceNum: 1450,
    badge: "New Arrival",
    desc: "A featherlight serum with 24k gold micro-particles and rose hip oil for a luminous, plumped complexion.",
    imgs: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop"
    ],
    info: ["24K Gold Particles", "Rosehip Oil", "Hyaluronic Acid", "30ml", "All Skin Types"],
    reviewCount: 708,
    reviews: [
      { name: "Trisha V.", stars: 5, date: "Mar 2025", text: "My skin literally glows after using this. The texture is so luxurious and non-greasy." },
      { name: "Sophie A.", stars: 5, date: "Feb 2025", text: "Worth every peso. I've received so many compliments on my skin since I started using it." }
    ]
  },
  {
    id: 3,
    name: "Velvet Matte Lipstick",
    brand: "Lumière Beauty",
    category: "Make Up",
    price: "₱520",
    priceNum: 519.99,
    badge: null,
    desc: "Richly pigmented matte lip color that wears for 10 hours without drying or fading.",
    imgs: [
      "https://images.unsplash.com/photo-1586495777744-4e6232bf5040?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590156646043-7bda0b813cdb?w=800&auto=format&fit=crop"
    ],
    info: ["10-Hour Wear", "18 Shades", "Vitamin E", "Cruelty-Free", "3.5g"],
    reviewCount: 856,
    reviews: [
      { name: "Lia S.",  stars: 5, date: "Mar 2025", text: "The pigmentation is incredible and it doesn't dry out my lips at all. My go-to!" },
      { name: "Kim P.",  stars: 5, date: "Feb 2025", text: "So many beautiful shades. This stays put all day without any touch-ups needed." },
      { name: "Mika T.", stars: 5, date: "Jan 2025", text: "Best matte lipstick I've ever tried. Comfortable to wear for a whole day." }
    ]
  },
  {
    id: 4,
    name: "Cuticle Restore Oil",
    brand: "Lumière Nails",
    category: "Nail Care",
    price: "₱380",
    priceNum: 379.99,
    badge: null,
    desc: "A blend of jojoba, vitamin E, and lavender oil that instantly heals dry, cracked cuticles.",
    imgs: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604654894610-df490982580e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604655840975-f9c2f8e1d3c1?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop"
    ],
    info: ["Jojoba Oil", "Vitamin E", "Lavender Extract", "15ml Pen", "Fast-Absorbing"],
    reviewCount: 412,
    reviews: [
      { name: "Rosa G.", stars: 5, date: "Mar 2025", text: "My cuticles have never looked better. The lavender scent is so calming." },
      { name: "Abby C.", stars: 4, date: "Feb 2025", text: "Convenient pen applicator. Absorbs quickly and doesn't feel greasy at all." }
    ]
  },
  {
    id: 5,
    name: "Overnight Hair Mask",
    brand: "Lumière Essentials",
    category: "Hair Care",
    price: "₱890",
    priceNum: 889.99,
    badge: "Staff Pick",
    desc: "Wake up to transformed, glossy hair with this rich overnight treatment packed with argan and shea.",
    imgs: [
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop"
    ],
    info: ["Argan Oil", "Shea Butter", "Leave-In Formula", "200ml", "All Hair Types"],
    reviewCount: 620,
    reviews: [
      { name: "Carla N.",   stars: 5, date: "Mar 2025", text: "I woke up with the softest, most manageable hair I've ever had. Absolutely magical." },
      { name: "Frances B.", stars: 5, date: "Feb 2025", text: "This is my holy grail. My frizzy hair is completely tamed after one night of use." }
    ]
  },
  {
    id: 6,
    name: "Brightening Eye Cream",
    brand: "Lumière Skin",
    category: "Skin Care",
    price: "₱1,100",
    priceNum: 1099.99,
    badge: "Top Rated",
    desc: "Clinically formulated to reduce dark circles and puffiness with caffeine and peptide complex.",
    imgs: [
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop"
    ],
    info: ["Caffeine Complex", "Peptide Blend", "Ceramides", "15ml", "Dermatologist-Tested"],
    reviewCount: 930,
    reviews: [
      { name: "Ingrid V.", stars: 5, date: "Mar 2025", text: "My under-eye circles are visibly lighter after two weeks. I'm absolutely amazed." },
      { name: "Bea S.",    stars: 5, date: "Feb 2025", text: "The cooling applicator tip feels amazing in the morning. My eyes look so much more awake." },
      { name: "Nica L.",   stars: 4, date: "Jan 2025", text: "Gentle enough for sensitive skin and it actually works. A rare combination." }
    ]
  }
];

// ─── State ────────────────────────────────────────────────────────────────────

let activeCategory = 'all';
let overlay;

// Per-card quantity — keyed by product id, survives filter/sort re-renders
const cardQtyMap = {};

function getCardQty(id) {
  return cardQtyMap[id] ?? 1;
}

function setCardQty(id, val) {
  cardQtyMap[id] = Math.min(10, Math.max(1, val));
}

// ─── Cart helpers ─────────────────────────────────────────────────────────────

const CART_KEY = 'cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addItemToCart(product, qty) {
  const cart  = getCart();
  const id    = String(product.id);
  const match = cart.find(i => i.id === id);
  if (match) {
    match.qty += qty;
  } else {
    cart.push({
      id,
      name:             product.name,
      price:            product.priceNum,
      desc:             product.desc,
      image:            product.imgs[0] || '',
      qty,
      deliveryOptionId: 1,
    });
  }
  saveCart(cart);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderProducts(list) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <p style="text-align:center;padding:3rem;color:var(--muted,#6b7a8d);
                font-family:'Jost',sans-serif;letter-spacing:1.5px;font-size:0.85rem;">
        No products match your search.
      </p>`;
    return;
  }

  grid.innerHTML = list.map(product => {
    const qty = getCardQty(product.id);
    return `
      <div class="card" data-id="${product.id}">
        <div class="card-img" style="background-image:url('${product.imgs[0]}')">
          ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
        </div>
        <div class="card-content">
          <div class="card-category">${product.category}</div>
          <div class="card-name">${product.name}</div>
          <div class="card-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-count" id="card-rating-${product.id}">${product.reviewCount} reviews</span>
          </div>
          <div class="card-footer">
            <span class="card-price">${product.price}</span>
            <div class="card-qty-row">
              <span class="card-qty-label">Qty</span>
              <div class="card-qty-controls">
                <button class="card-qty-btn" data-action="minus" type="button">−</button>
                <span class="card-qty-num" id="qty-num-${product.id}">${qty}</span>
                <button class="card-qty-btn" data-action="plus" type="button">+</button>
              </div>
              <button class="card-qty-update" data-action="update" type="button">Update</button>
            </div>
            <div class="card-actions">
              <button class="add-to-cart-btn" data-action="cart" type="button">Add to Cart</button>
              <button class="view-btn" data-action="view" type="button">View More</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── Filter / Sort ────────────────────────────────────────────────────────────

function filterCategory(button, category) {
  document.querySelectorAll('.pill').forEach(pill => pill.classList.remove('active'));
  button.classList.add('active');
  activeCategory = category;
  applyFilters();
}

function applyFilters() {
  const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const sort  = document.getElementById('sortSelect')?.value || 'default';
  let list    = [...products];

  if (activeCategory !== 'all') {
    list = list.filter(p => p.category === activeCategory);
  }

  if (query) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query)
    );
  }

  if (sort === 'price-asc')  list.sort((a, b) => a.priceNum - b.priceNum);
  if (sort === 'price-desc') list.sort((a, b) => b.priceNum - a.priceNum);

  renderProducts(list);
}

// ─── Events ───────────────────────────────────────────────────────────────────

function initEvents() {
  const grid            = document.getElementById('products-grid');
  const pills           = document.querySelectorAll('.pill');
  const searchBtn       = document.querySelector('.search-btn');
  const searchInput     = document.getElementById('searchInput');
  const sortSelect      = document.getElementById('sortSelect');
  const backBtn         = document.getElementById('backBtn');
  const qtyUpdateBtn    = document.getElementById('qtyUpdateBtn');
  const addToCartBtn    = document.getElementById('addToCartBtn');
  const buyNowBtn       = document.getElementById('buyNowBtn');
  const submitReviewBtn = document.getElementById('submitReviewBtn');
  const starPicker      = document.getElementById('starPicker');
  const thumbBar        = document.getElementById('thumbBar');

  // ── Filter pills ──
  pills.forEach(button => {
    button.addEventListener('click', () => filterCategory(button, button.dataset.category));
  });

  // ── Search / sort ──
  searchBtn?.addEventListener('click', applyFilters);
  searchInput?.addEventListener('input', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);

  // ── Card grid — event delegation ──
  grid?.addEventListener('click', event => {
    const actionBtn = event.target.closest('button[data-action]');
    const card      = event.target.closest('.card');
    if (!card) return;

    const id      = Number(card.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    const action = actionBtn?.dataset.action;

    if (action === 'minus') {
      event.stopPropagation();
      setCardQty(id, getCardQty(id) - 1);
      const el = document.getElementById(`qty-num-${id}`);
      if (el) el.textContent = getCardQty(id);
      return;
    }

    if (action === 'plus') {
      event.stopPropagation();
      setCardQty(id, getCardQty(id) + 1);
      const el = document.getElementById(`qty-num-${id}`);
      if (el) el.textContent = getCardQty(id);
      return;
    }

    if (action === 'update') {
      event.stopPropagation();
      showToast('Quantity updated.');
      return;
    }

    if (action === 'cart') {
      event.stopPropagation();
      const qty = getCardQty(id);
      addItemToCart(product, qty);
      showToast(`Added ${qty} × ${product.name} to cart ✨`);
      return;
    }

    // 'view' button OR bare card click → open overlay
    overlay.open(id);
  });

  // ── Overlay: back ──
  backBtn?.addEventListener('click', () => overlay.close());

  // ── Overlay: qty update ──
  qtyUpdateBtn?.addEventListener('click', () => {
    if (!overlay?.currentItem) return;
    const input = document.getElementById('qtyInput');
    if (!input) return;
    let val = parseInt(input.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 10)              val = 10;
    input.value = val;
    input.classList.add('invalid');
    setTimeout(() => input.classList.remove('invalid'), 320);
    showToast(`Quantity updated to ${val}`);
  });

  // ── Overlay: add to cart ──
  addToCartBtn?.addEventListener('click', () => {
    if (!overlay?.currentItem) return;
    const qty = Math.min(10, Math.max(1, parseInt(document.getElementById('qtyInput')?.value, 10) || 1));
    addItemToCart(overlay.currentItem, qty);
    showToast(`Added ${qty} × ${overlay.currentItem.name} to cart ✨`);
  });

  // ── Overlay: buy now ──
  buyNowBtn?.addEventListener('click', () => {
    if (!overlay?.currentItem) return;
    const qty = Math.min(10, Math.max(1, parseInt(document.getElementById('qtyInput')?.value, 10) || 1));
    addItemToCart(overlay.currentItem, qty);
    window.location.href = 'checkout.html';
  });

  // ── Overlay: submit review ──
  submitReviewBtn?.addEventListener('click', () => {
    overlay.submitReview(showToast);
  });

  // ── Overlay: star picker ──
  starPicker?.addEventListener('click', event => {
    const star = event.target.closest('span[data-stars]');
    if (!star) return;
    overlay.setStars(Number(star.dataset.stars));
  });

  // ── Overlay: thumbnails ──
  thumbBar?.addEventListener('mouseover', event => {
    const thumb = event.target.closest('.thumb');
    if (!thumb) return;
    overlay.hoverImg(Number(thumb.dataset.index));
  });

  thumbBar?.addEventListener('mouseout', event => {
    const thumb = event.target.closest('.thumb');
    if (!thumb) return;
    overlay.unhoverImg();
  });

  thumbBar?.addEventListener('click', event => {
    const thumb = event.target.closest('.thumb');
    if (!thumb) return;
    overlay.setImg(Number(thumb.dataset.index));
  });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  overlay = new ProductOverlay(products, (id, count) => {
    const cardRating = document.getElementById(`card-rating-${id}`);
    if (cardRating) cardRating.textContent = `${count} reviews`;
  });

  initEvents();
  renderProducts(products);
});

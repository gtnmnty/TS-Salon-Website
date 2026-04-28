import { deliveryOpts } from '../data/deliveryOption.js';
import { products } from '../data/products.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js';

const CART_KEY = 'cart';
const ORDERS_KEY = 'orders';
const DEFAULT_DELIVERY_ID = deliveryOpts?.[0]?.id ?? 1;

/* ── Helpers ── */
function normalizePrice(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function normalizeQty(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];
  let changed = false;
  const normalized = cart.map(item => {
    const next = { ...item };
    const rawId = item.id ?? item.productId ?? '';
    next.id = String(rawId);
    const product = products.find(p => String(p.id) === next.id);
    if (product) {
      if (!next.name || next.name === 'Unknown') { next.name = product.name; changed = true; }
      if (!next.desc) { next.desc = product.desc; changed = true; }
      if (!next.image) { next.image = product.imgs?.[0] || ''; changed = true; }
      if (!next.price || !Number.isFinite(Number(next.price))) { next.price = Number(product.priceNum); changed = true; }
    }
    next.price = normalizePrice(next.price);
    next.qty = normalizeQty(next.qty);
    if (!next.deliveryOptionId) { next.deliveryOptionId = DEFAULT_DELIVERY_ID; changed = true; }
    if (next.price !== item.price || next.qty !== item.qty || next.id !== item.id) changed = true;
    return next;
  });
  if (changed) saveCart(normalized);
  return normalized;
}

function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    return normalizeCart(raw);
  } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
  catch { return []; }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function formatPrice(n) {
  const safe = Number.isFinite(n) ? n : 0;
  return '₱ ' + safe.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Delivery date using dayjs ── */
function getEstimatedDelivery(deliveryDays) {
  if (deliveryDays === 0) return 'Today';
  return dayjs().add(deliveryDays, 'day').format('MMM D, YYYY');
}

/* ── Summary ── */
function updateSummary(itemsCount, shipping, total) {
  const vals = document.querySelectorAll('.summary-item .summary-val');
  if (vals[0]) vals[0].textContent = itemsCount;
  if (vals[1]) vals[1].textContent = formatPrice(shipping);
  if (vals[2]) vals[2].textContent = formatPrice(total);
}

function updateHeader(items) {
  const subtitle = document.querySelector('.page-subtitle');
  if (subtitle) subtitle.textContent = `${items} item${items === 1 ? '' : 's'} selected`;
}

/* ── Render ── */
function renderCart() {
  const cart = getCart();
  const cartList = document.getElementById('cartList');
  if (!cartList) return;

  if (!cart.length) {
    cartList.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    updateSummary(0, 0, 0);
    updateHeader(0);
    return;
  }

  cartList.innerHTML = cart.map(item => {
    const delivery = deliveryOpts.find(d => d.id === item.deliveryOptionId) || deliveryOpts[0];
    const shippingFee = delivery?.deliveryPrice || 0;
    const itemSubtotal = (item.price * item.qty) + shippingFee;
    const estimatedDate = getEstimatedDelivery(delivery?.deliveryDays ?? 5);

    return `
      <div class="cart-card" data-id="${item.id}">
        <div class="cart-img">
          <div class="cart-img-placeholder">
            ${item.image ? `<img src="${item.image}" alt="${item.name || ''}" />` : ''}
          </div>
        </div>
        <div class="cart-details">
          <p class="cart-name">${item.name || 'Unknown Product'}</p>
          <p class="cart-desc">${item.desc || ''}</p>
          <p class="cart-price">${formatPrice(item.price)}</p>
          <div class="qty-row">
            <span class="qty-label">Qty</span>
            <div class="qty-ctrl">
              <button class="qty-btn" data-dir="-1">−</button>
              <input class="qty-val" type="number" value="${item.qty}" min="1" max="10" />
              <button class="qty-btn" data-dir="1">+</button>
            </div>
            <button class="btn-link btn-update" data-action="update">Update</button>
            <button class="btn-link btn-delete" data-action="delete">Delete</button>
          </div>
          <div class="cart-meta">
            <span>Shipping: <b>${formatPrice(shippingFee)}</b></span>
            <span>Estimated Arrival: <b>${estimatedDate}</b></span>
            <span>Subtotal: <b>${formatPrice(itemSubtotal)}</b></span>
          </div>
        </div>
        <div class="cart-right">
          <select class="delivery-select">
            ${deliveryOpts.map(opt => `
              <option value="${opt.id}" ${opt.id === item.deliveryOptionId ? 'selected' : ''}>
                ${opt.name} (${opt.deliveryDays === 0 ? 'Today' : opt.deliveryDays + ' days'}) — ${opt.deliveryPrice === 0 ? 'Free' : formatPrice(opt.deliveryPrice)}
              </option>
            `).join('')}
          </select>
          <button class="btn-checkout" data-action="checkout">Checkout Item</button>
        </div>
      </div>
    `;
  }).join('');

  const itemsCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const shippingTotal = cart.reduce((sum, i) => {
    const d = deliveryOpts.find(d => d.id === i.deliveryOptionId) || deliveryOpts[0];
    return sum + (d?.deliveryPrice || 0);
  }, 0);
  const itemsTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  updateSummary(itemsCount, shippingTotal, itemsTotal + shippingTotal);
  updateHeader(itemsCount);
}

/* ── Cart mutations ── */
function updateQty(id, dir) {
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;
  item.qty = Math.min(10, Math.max(1, item.qty + dir));
  saveCart(cart);
  renderCart();
}

function applyQty(id, newQty) {
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;
  item.qty = Math.min(10, Math.max(1, newQty));
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(i => String(i.id) !== String(id)));
  renderCart();
}

/* ── Checkout single item ── */
function checkoutItem(id) {
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;

  const delivery = deliveryOpts.find(d => d.id === item.deliveryOptionId) || deliveryOpts[0];
  const order = {
    orderId: '#' + String(Date.now()).slice(-5),
    placedAt: dayjs().format('MMM D, YYYY h:mm A'),
    items: [{ ...item }],
    delivery: delivery.name,
    estimatedArrival: getEstimatedDelivery(delivery.deliveryDays),
    shippingFee: delivery.deliveryPrice,
    itemsTotal: item.price * item.qty,
    grandTotal: (item.price * item.qty) + delivery.deliveryPrice,
    status: 'Processing'
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);

  // Remove from cart
  saveCart(cart.filter(i => String(i.id) !== String(id)));
  renderCart();

  showToast(`Order ${order.orderId} placed! Redirecting…`);
  setTimeout(() => { window.location.href = 'orders.html'; }, 1800);
}

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Events ── */
document.addEventListener('click', (e) => {
  const card = e.target.closest('.cart-card');
  if (!card) return;
  const id = card.dataset.id;

  const qtyBtn = e.target.closest('.qty-btn');
  if (qtyBtn) { updateQty(id, Number(qtyBtn.dataset.dir || 0)); return; }

  const actionBtn = e.target.closest('button[data-action]');
  if (!actionBtn) return;

  if (actionBtn.dataset.action === 'update') {
    const input = card.querySelector('.qty-val');
    applyQty(id, parseInt(input?.value || '1', 10));
    return;
  }
  if (actionBtn.dataset.action === 'delete') { removeItem(id); return; }
  if (actionBtn.dataset.action === 'checkout') { checkoutItem(id); return; }
});

document.addEventListener('change', (e) => {
  const select = e.target.closest('.delivery-select');
  if (!select) return;
  const card = select.closest('.cart-card');
  if (!card) return;
  const id = card.dataset.id;
  const newId = parseInt(select.value, 10);
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;
  item.deliveryOptionId = Number.isFinite(newId) ? newId : DEFAULT_DELIVERY_ID;
  saveCart(cart);
  renderCart();
});

document.addEventListener('DOMContentLoaded', renderCart);

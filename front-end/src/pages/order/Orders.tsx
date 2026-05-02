import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Order } from '../../../../backend/types/orders';
import type { UserAccount } from '../../../../backend/types/users';
import type { CartItem } from '../../../../backend/types/cart';
import type { OrderItem } from '../../../../backend/types/orders';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import './Orders.css';

// ── HELPERS ──
function fmt(n: number) {
  return '₱ ' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function badgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === 'shipped') return 'ord-badge-shipped';
  if (s === 'delivered') return 'ord-badge-delivered';
  if (s === 'cancelled') return 'ord-badge-cancelled';
  return 'ord-badge-processing';
}

function badgeLabel(status: string) {
  const s = status.toLowerCase();
  if (s === 'shipped') return 'In Transit';
  if (s === 'delivered') return 'Delivered';
  if (s === 'cancelled') return 'Cancelled';
  return 'Processing';
}

const TIMELINE_STEPS = ['Placed', 'Packed', 'Shipped', 'Delivered'];

function timelineCount(status: string) {
  const s = status.toLowerCase();
  if (s === 'delivered') return 4;
  if (s === 'shipped') return 3;
  return 2;
}

// ── TOAST ──
function Toast({ message }: { message: string }) {
  return <div className={`ord-toast${message ? ' show' : ''}`}>{message}</div>;
}

// ── TIMELINE ──
function Timeline({ status }: { status: string }) {
  const active = timelineCount(status);
  return (
    <div className="ord-timeline">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step} className="ord-tl-wrap">
          {i > 0 && <div className={`ord-tl-line${i < active ? '' : ' inactive'}`} />}
          <div className="ord-tl-step">
            <div className={`ord-tl-dot${i < active ? '' : ' inactive'}`} />
            <span className={`ord-tl-label${i < active ? ' active' : ''}`}>{step}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEstDelivery(order: Order): string {
  const maxDays = order.items.reduce((max, item) => {
    const days = item.deliveryDays ?? 5;
    return days > max ? days : max;
  }, 0);

  if (maxDays === 0) return 'Today';

  const date = new Date(order.date);
  date.setDate(date.getDate() + maxDays);
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── ORDER CARD ──
function OrderCard({ order, onToast }: { order: Order; onToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const bc = badgeClass(order.status);
  const bl = badgeLabel(order.status);

  const addToCart = (item: OrderItem) => {
    try {
      const current: CartItem[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
      const existing = current.find(c => c.id === item.productId);
      if (existing) {
        existing.qty += item.quantity;
      } else {
        current.push({
          id: item.productId,
          name: item.name,
          desc: '',
          image: item.image ?? '',
          price: item.price,
          qty: item.quantity,
          deliveryOptionId: 1,
        });
      }
      localStorage.setItem('cart', JSON.stringify(current));
      onToast('Added to cart!');
    } catch {
      onToast('Could not add to cart.');
    }
  };

  return (
    <div className="ord-card">
      {/* HEADER */}
      <div className="ord-card-header">
        <div className="ord-header-left">
          <div className="ord-number">{order.id}</div>
          <div className="ord-date">
            Est. Delivery: <em>{getEstDelivery(order)}</em>
          </div>
          <button className="ord-track-btn" onClick={() => {
            navigate('/track', { state: { orderId: order.id } })
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M7 4.5V7.5L9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Track Order
          </button>
        </div>
        <div className="ord-header-right">
          <span className="ord-status-label">Order Status</span>
          <div className={`ord-badge ${bc}`}>
            <span className="ord-badge-dot" />
            {bl}
          </div>
          <Timeline status={order.status} />
        </div>
      </div>

      {/* ITEMS */}
      <div className="ord-items">
        {order.items.map((item, i) => (
          <div className="ord-item" key={i}>
            <div className="ord-item-img">
              <div className="ord-item-media">
                {item.image
                  ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg className="ord-img-placeholder" width="52" height="52" viewBox="0 0 36 36" fill="none">
                    <rect x="6" y="8" width="24" height="20" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="13" cy="16" r="3" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 26L12 20L16 24L22 17L30 26" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                }
              </div>
            </div>
            <div className="ord-item-body">
              <div className="ord-item-name">{item.name}</div>
              <div className="ord-item-meta">
                <span className="ord-meta-qty">Qty: <strong>{item.quantity}</strong></span>
                <span className="ord-meta-dot" />
                <span className="ord-meta-total">Total: <strong>{fmt(item.price * item.quantity)}</strong></span>
                <span className="ord-meta-dot" />
                <span className="ord-meta-qty">{item.deliveryType ?? 'Standard Delivery'}</span>
              </div>
              <div className="ord-item-actions">
                <button className="ord-btn-cart" onClick={() => {
                  onToast('Added to cart!')
                  addToCart(item)
                }}>
                  Add to Cart
                </button>
                <button className="ord-btn-buy" onClick={() => {
                  const checkoutItem = [{
                    id: item.productId,
                    name: item.name,
                    desc: '',
                    image: item.image ?? '',
                    price: item.price,
                    qty: item.quantity,
                    deliveryOptionId: 1,
                    deliveryType: item.deliveryType ?? 'Standard Delivery',
                    deliveryDays: item.deliveryDays ?? 5,
                  }];
                  sessionStorage.setItem('checkoutItems', JSON.stringify(checkoutItem));
                  navigate('/checkout');
                }}>
                  Buy Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="ord-card-footer">
        <div className="ord-footer-left">
          <div className="ord-footer-delivery">🚚 Shipping: {fmt(0)}</div>
          <div className="ord-footer-sep" />
          <div className="ord-footer-total">Total: <span>{fmt(order.total)}</span></div>
        </div>
      </div>
      <div className="ord-ornament">— ✦ —</div>
    </div>
  );
}

// ── MAIN ──
export function Orders() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  const currentUser: UserAccount | null = (() => {
    try { return JSON.parse(sessionStorage.getItem('currentUser') ?? 'null'); }
    catch { return null; }
  })();

  const orders: Order[] = currentUser?.orders ?? [];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <title>GILDED - My Orders</title>
      <Header />

      <header className="ord-top-bar">
        <button className="ord-back-link" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="ord-page-title">My Orders</div>
        <div />
      </header>

      <div className="ord-page-wrap">
        {orders.length === 0 ? (
          <div className="ord-empty">
            <p>You haven't placed any orders yet.</p>
            <a href="/products">Start shopping →</a>
          </div>
        ) : (
          [...orders].reverse().map(order => (
            <OrderCard key={order.id} order={order} onToast={showToast} />
          ))
        )}
      </div>

      <Footer />
      <Toast message={toast} />
    </>
  );
}
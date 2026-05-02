import { useNavigate, useLocation } from 'react-router';
import type { Order } from '../../../../backend/types/orders';
import type { UserAccount } from '../../../../backend/types/users';
import { Header } from '../../components/Header';
import './Track.css';

// ── TYPES ──
type StepState = 'done' | 'active' | 'pending';

interface TimelineStep {
  label: string;
  title: string;
  time: string;
  note: string;
  state: StepState;
}

// ── HELPERS ──
function fmt(n: number) {
  return '₱ ' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getSteps(status: string, deliveryType?: string, orderDate?: string, deliveryDays?: number): TimelineStep[] {
  const s = status.toLowerCase();
  const days = deliveryDays ?? 5;
  const base = orderDate ? new Date(orderDate) : new Date();

  const formatDateTime = (d: Date, timeStr: string) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + timeStr;

  const addDays = (d: Date, n: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + n);
    return copy;
  };

  const isPickup = deliveryType?.toLowerCase().includes('pick up');
  const isSameDay = deliveryType?.toLowerCase().includes('same day');

  if (isPickup || isSameDay) {
    return [
      {
        label: 'Placed', title: 'Order Placed',
        time: formatDateTime(base, '10:42 AM'),
        note: 'Your order has been received and confirmed. Payment verified.',
        state: 'done'
      },
      {
        label: 'Ready', title: 'Ready for Pickup',
        time: formatDateTime(base, '11:30 AM'),
        note: 'Waiting at Gilded branch counter. Bring order ID & valid ID.',
        state: s === 'pending' ? 'pending' : 'active'
      },
      {
        label: 'Picked Up', title: 'Picked Up',
        time: formatDateTime(base, '—'),
        note: 'Awaiting your visit. Reserved for 3 days.',
        state: s === 'delivered' ? 'active' : 'pending'
      },
    ];
  }

  // calculate stage dates by dividing deliveryDays into intervals
  const interval = days / 4;
  const d0 = base;
  const d1 = addDays(base, Math.round(interval * 0.5));
  const d2 = addDays(base, Math.round(interval * 1.5));
  const d3 = addDays(base, Math.round(interval * 2.5));
  const d4 = addDays(base, days);

  return [
    {
      label: 'Placed', title: 'Order Placed',
      time: formatDateTime(d0, '10:42 AM'),
      note: 'Your order has been received and confirmed. Payment verified.',
      state: 'done'
    },
    {
      label: 'Preparing', title: 'Preparing',
      time: formatDateTime(d1, '3:15 PM'),
      note: 'Our team is carefully packing your items at the Cubao branch.',
      state: s === 'pending' ? 'pending' : 'done'
    },
    {
      label: 'Shipped', title: 'Shipped',
      time: formatDateTime(d2, '8:30 AM'),
      note: 'Package handed to J&T Express. Tracking no. JT-1238904561-PH',
      state: s === 'pending' || s === 'processing' ? 'pending'
        : s === 'shipped' ? 'active'
          : 'done'
    },
    {
      label: 'Out for Delivery', title: 'Out for Delivery',
      time: `Estimated: ${d3.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      note: 'Your package will be with the local courier for delivery.',
      state: s === 'delivered' ? 'done' : 'pending'
    },
    {
      label: 'Delivered', title: 'Delivered',
      time: `Estimated: ${d4.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      note: 'Awaiting delivery to your address.',
      state: s === 'delivered' ? 'active' : 'pending'
    },
  ];
}

function statusPill(status: string) {
  const s = status.toLowerCase();
  if (s === 'delivered') return { label: 'Delivered', cls: 'trk-pill-ready' };
  if (s === 'shipped') return { label: 'In Transit', cls: 'trk-pill-transit' };
  if (s === 'cancelled') return { label: 'Cancelled', cls: 'trk-pill-pending' };
  return { label: 'Processing', cls: 'trk-pill-pending' };
}

// ── TIMELINE ──
function Timeline({ steps }: { steps: TimelineStep[] }) {
  const count = steps.length;
  const gridCols = Array.from({ length: count * 2 - 1 }, (_, i) =>
    i % 2 === 0 ? '20px' : '1fr'
  ).join(' ');

  return (
    <>
      {/* TRACK */}
      <div className="trk-h-track" style={{ gridTemplateColumns: gridCols }}>
        {steps.map((step, i) => (
          <>
            <div key={`dot-${i}`} className="trk-h-step">
              <div className={`trk-h-dot ${step.state}`} />
            </div>
            {i < steps.length - 1 && (
              <div
                key={`conn-${i}`}
                className={`trk-h-connector${steps[i + 1]?.state !== 'pending' ? ' done' : ''}`}
              />
            )}
          </>
        ))}
      </div>

      {/* LABELS */}
      <div className="trk-h-labels" style={{ gridTemplateColumns: gridCols }}>
        {steps.map((step, i) => (
          <>
            <div key={`lbl-${i}`} className="trk-h-label-cell">
              <span className={`trk-h-label ${step.state}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div key={`lbl-gap-${i}`} />}
          </>
        ))}
      </div>

      {/* DETAILS */}
      <div
        className="trk-h-details"
        style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
      >
        {steps.map((step, i) => (
          <div key={i} className={`trk-h-detail ${step.state}`}>
            <p className="trk-h-detail-title">{step.title}</p>
            <p className="trk-h-detail-time">{step.time}</p>
            <p className="trk-h-detail-note">{step.note}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ── ORDER ITEM GROUP ──
function ItemGroup({ item, status, orderDate }: {
  item: {
    name: string;
    quantity: number;
    price: number;
    deliveryType?: string;
    deliveryDays?: number;
  };
  status: string;
  orderDate: string;
}) {
  const steps = getSteps(status, item.deliveryType, orderDate, item.deliveryDays);
  const pill = statusPill(status);

  return (
    <div className="trk-item-group">
      <div className="trk-item-card">
        <div className="trk-item-thumb trk-thumb-serum">
          <svg viewBox="0 0 48 48" fill="none">
            <rect x="18" y="4" width="12" height="6" rx="2" stroke="#A53860" strokeWidth="1.4" />
            <path d="M14 10h20l3 28a3 3 0 01-3 3H14a3 3 0 01-3-3l3-28z" stroke="#A53860" strokeWidth="1.4" />
            <path d="M11 18h26" stroke="#A53860" strokeWidth="1.2" strokeDasharray="2 2" />
          </svg>
        </div>
        <div className="trk-item-info">
          <p className="trk-item-name">{item.name}</p>
          <p className="trk-item-sub">Qty: {item.quantity}</p>
          <span className={`trk-item-delivery-badge ${item.deliveryType?.toLowerCase().includes('standard') ? 'trk-badge-standard' : 'trk-badge-express'
            }`}>
            {item.deliveryType ?? 'Standard Delivery'}
          </span>
        </div>
        <span className="trk-item-price">{fmt(item.price * item.quantity)}</span>
      </div>

      <div className="trk-timeline-card">
        <div className="trk-timeline-meta">
          <span className="trk-timeline-label">Delivery Timeline</span>
          <span className={`trk-timeline-pill ${pill.cls}`}>{pill.label}</span>
        </div>
        <Timeline steps={steps} />
      </div>
    </div>
  );
}

// ── MAIN ──
export function Tracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = (location.state as { orderId?: string })?.orderId;

  const currentUser: UserAccount | null = (() => {
    try { return JSON.parse(sessionStorage.getItem('currentUser') ?? 'null'); }
    catch { return null; }
  })();

  const order: Order | undefined = currentUser?.orders.find(o => o.id === orderId);

  return (
    <div>
      <title>GILDED - Track Order</title>
      <Header />

      <div className="trk-page">
        <button className="trk-back-link" onClick={() => navigate('/orders')}>
          ← View All Orders
        </button>

        <h1 className="trk-page-title">Track <em>Order</em></h1>

        {!order ? (
          <div className="trk-empty">
            <p>Order not found.</p>
            <button onClick={() => navigate('/orders')}>Back to Orders</button>
          </div>
        ) : (
          <>
            {/* META */}
            <div className="trk-order-meta">
              <div className="trk-meta-chip">
                <span className="trk-meta-lbl">Order ID</span>
                <span className="trk-meta-val">{order.id}</span>
              </div>
              <div className="trk-meta-chip">
                <span className="trk-meta-lbl">Placed On</span>
                <span className="trk-meta-val">{order.date}</span>
              </div>
              <div className="trk-meta-chip">
                <span className="trk-meta-lbl">Items</span>
                <span className="trk-meta-val">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
              </div>
              <div className="trk-meta-chip">
                <span className="trk-meta-lbl">Order Total</span>
                <span className="trk-meta-val">{fmt(order.total)}</span>
              </div>
            </div>

            {/* ITEMS */}
            {order.items.map((item, i) => (
              <ItemGroup key={i} item={item} status={order.status} orderDate={order.date} />
            ))}

            {/* ACTIONS */}
            <div className="trk-action-row">
              <button className="trk-btn-outline" onClick={() => navigate('/about-us#contact')}>
                Need Help?
              </button>
              <button className="trk-btn-solid" onClick={() => navigate('/products')}>
                Buy Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
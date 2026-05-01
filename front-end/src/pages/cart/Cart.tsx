import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { CartItem } from '../../../../backend/types/cart';
import { deliveryOpts } from '../../../../backend/data/deliveryOption';
import { formatCurrency } from './cartFormat';
import { Header } from '../../components/Header';
import './Cart.css'



const Cart: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load directly in useState initializer — runs once, synchronously
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          setCart([]);
        }
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
        setCart([]);
      }
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (Array.isArray(cart)) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from cart.');
  };

  const updateDelivery = (itemId: string, optionId: number) => {
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, deliveryOptionId: optionId } : item
    ));
  };

  const updateItem = (item: CartItem) => {
    setCart(prev => prev.map(i => i.id === item.id ? { ...item } : i));
    showToast('Cart updated!');
  };

  const totals = {
    items: cart.reduce((sum, i) => sum + i.qty, 0),
    subtotal: cart.reduce((sum, i) => sum + (i.price * i.qty), 0),
    shipping: cart.reduce((sum, i) => {
      const opt = deliveryOpts.find(o => o.id === i.deliveryOptionId);
      return sum + (opt?.deliveryPrice || 0);
    }, 0)
  };

  return (
    <div className='cart-page-wrapper'>
      <title>My Cart</title>
      <Header />
      <main className="cart-page">
        {toast && <div className="toast show">{toast}</div>}

        <header className="page-header">
          <div className="page-header-row">
            <h1 className="page-title">My <span>Cart</span></h1>
            <p className="page-subtitle">{totals.items} {totals.items === 1 ? 'item' : 'items'} selected</p>
          </div>
        </header>

        <section className="cart-list">
          {cart.length === 0 ? (
            <div className="cart-empty">
              Your cart is empty. <a href="/products">Shop now</a>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeItem}
                onUpdate={updateItem}
                onUpdateDelivery={updateDelivery}
              />
            ))
          )}
        </section>

        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="summary-items-group">
              <SummaryItem label="Items" value={totals.items.toString()} />
              <SummaryItem label="Shipping" value={formatCurrency(totals.shipping)} />
              <SummaryItem label="Order Total" value={formatCurrency(totals.subtotal + totals.shipping)} />
            </div>
            <button className="btn-checkout-main" onClick={() => navigate('/checkout')}>
              Checkout All
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onUpdate: (item: CartItem) => void;
  onUpdateDelivery: (id: string, optionId: number) => void;
}

const CartItemRow = ({ item, onUpdateQty, onRemove, onUpdate, onUpdateDelivery }: CartItemRowProps) => {
  const delivery = deliveryOpts.find(o => o.id === item.deliveryOptionId) || deliveryOpts[0];
  const navigate = useNavigate();

  return (
    <article className="cart-item">
      <div className="cart-img-shell">
        <div className={`cart-img ${!item.image && 'is-empty'}`}>
          {item.image && <img src={item.image} alt={item.name} />}
        </div>
      </div>

      <div className="cart-item-info">
        <h2 className="cart-item-name">{item.name}</h2>
        <p className="cart-item-desc">{item.desc}</p>
        <p className="cart-item-price">{formatCurrency(item.price)}</p>

        <div className="qty-row">
          <span className="qty-label">Qty</span>
          <div className="qty-controls">
            <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>-</button>
            <span className="qty-num">{item.qty}</span>
            <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)}>+</button>
          </div>
          <button className="text-action" onClick={() => onUpdate(item)}>Update</button>
          <button className="text-action" onClick={() => onRemove(item.id)}>Remove</button>
        </div>

        <div className="cart-meta">
          <div className="cart-meta-span">
            <span>Shipping: <strong>{formatCurrency(delivery?.deliveryPrice ?? 0)}</strong></span>
            <span>Subtotal: <strong>{formatCurrency(item.price * item.qty)}</strong></span>
          </div>
          <div className="cart-meta-button">
            <button className="btn-checkout-item" onClick={() => {
              sessionStorage.setItem('checkoutItems', JSON.stringify([item]));
              const current = JSON.parse(localStorage.getItem('cart') ?? '[]');
              const updated = current.filter((c: CartItem) => c.id !== item.id);
              localStorage.setItem('cart', JSON.stringify(updated));
              navigate('/checkout');
            }}>
              Checkout
            </button>
          </div>
        </div>
      </div>

      <div className="cart-item-side">
        <select className="delivery-select" value={item.deliveryOptionId} onChange={(e) => onUpdateDelivery(item.id, Number(e.target.value))}>
          {deliveryOpts.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.name} ({opt.deliveryDays} days) - {opt.deliveryPrice === 0 ? 'Free' : formatCurrency(opt.deliveryPrice)}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
};

const SummaryItem = ({ label, value }: { label: string, value: string }) => (
  <div className="summary-item">
    <span className="summary-label">{label}</span>
    <span className="summary-val">{value}</span>
  </div>
);

export default Cart;
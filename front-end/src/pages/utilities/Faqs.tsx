import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import type { FaqItem } from '../../../../backend/types/faqs.ts';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import './Faqs.css';

interface FAQCategory {
  id: string;
  title: string;
  em: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'appointments-booking', title: 'Appointments', em: '& Booking', items: [] },
  { id: 'services-pricing', title: 'Services', em: '& Pricing', items: [] },
  { id: 'products-aftercare', title: 'Products', em: '& Aftercare', items: [] },
  { id: 'orders-delivery', title: 'Orders', em: '& Delivery', items: [] },
  { id: 'shipping-returns', title: 'Shipping', em: '& Returns', items: [] },
  { id: 'account-payments', title: 'Account', em: '& Payments', items: [] },
];

function ItemComp({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const body = bodyRef.current;
    const inner = innerRef.current;

    if (!body || !inner) return;

    if (!open) {
      body.style.height = inner.offsetHeight + 'px';
    } else {
      body.style.height = body.offsetHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.style.height = '8px';
      }))
    }
    setOpen(prev => !prev);
  }

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" type="button" onClick={toggle}>
        {item.question}
        <span className="faq-icon">
          <svg viewBox="0 0 14 14" fill="none">
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </span>
      </button>
      <div className="faq-body" ref={bodyRef} style={{ height: '0px' }}>
        <div className="faq-inner" ref={innerRef}>
          {item.answer}
        </div>
      </div>
    </div>
  )
}

function FAQCategory({ category }: { category: FAQCategory }) {
  return (
    <div className="faq-category" data-cat={category.id}>
      <div className="cat-header">
        <h2 className="cat-title">
          {category.title} <em>{category.em}</em>
        </h2>
      </div>
      {category.items.map(item => (
        <ItemComp key={item.id} item={item} />
      ))}
    </div>
  )
}

export function Faqs() {
  const [categories, setCategories] = useState<FAQCategory[]>(FAQ_CATEGORIES);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/faqs')
      .then(res => {
        console.log('FAQ data:', res.data);
        const data = res.data;
        setCategories([
          { id: 'appointments-booking', title: 'Appointments', em: '& Booking', items: data.appointmentsBooking ?? [] },
          { id: 'services-pricing', title: 'Services', em: '& Pricing', items: data.servicesPricing ?? [] },
          { id: 'products-aftercare', title: 'Products', em: '& Aftercare', items: data.productsAftercare ?? [] },
          { id: 'orders-delivery', title: 'Orders', em: '& Delivery', items: data.ordersDelivery ?? [] },
          { id: 'shipping-returns', title: 'Shipping', em: '& Returns', items: data.shippingReturns ?? [] },
          { id: 'account-payments', title: 'Account', em: '& Payments', items: data.accountPayments ?? [] },
        ])
      })
      .catch(err => console.log(err));
  }, [])

  const filtered = categories.filter(cat => filter === 'all' || cat.id === filter)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item => !search || item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase()))
    })).filter(cat => cat.items.length > 0)

  return (
    <>
      <title>GILDED - FAQs</title>
      <Header />

      <section className="faq-hero">
        <h1>Frequently Asked <em>Questions</em></h1>
        <p>Everything you need to know about Gilded</p>
      </section>

      <div className="search-wrap">
        <div className="search-box">
          <select
            className="search-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {FAQ_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.title} {cat.em}</option>
            ))}
          </select>
          <input
            className="search-input"
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-btn" type="button">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </div>

      <div className="filter-pills">
        {['all', ...FAQ_CATEGORIES.map(c => c.id)].map(cat => (
          <button
            key={cat}
            className={`pill${filter === cat ? ' active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All' : FAQ_CATEGORIES.find(c => c.id === cat)?.title}
          </button>
        ))}
      </div>

      <div className="faq-page">
        {filtered.length > 0
          ? filtered.map(cat => <FAQCategory key={cat.id}  category={cat} />)
          : <div className="no-results"><p>No results found.</p></div>
        }
      </div>

      <Footer />
    </>
  )
}
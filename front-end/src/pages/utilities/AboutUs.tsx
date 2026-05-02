import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
import type { AccordionItem, ReviewItem } from '../../../../backend/types/about'

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import './AboutUs.css'

function AccordionItemComp({ item }: { item: AccordionItem }) {
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
        body.style.height = '0px';
      }));
    }
    setOpen(prev => !prev);
  }
  return (
    <div className={`accordion-item${open ? ' open' : ''}`}>
      <button className="accordion-header" aria-expanded={open} onClick={toggle}>
        <span className="accordion-title">{item.title}</span>
        <span className="accordion-icon">
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </span>
      </button>
      <div className="accordion-body" ref={bodyRef} style={{ height: '0px' }}>
        <div className="accordion-inner" ref={innerRef}>
          <p dangerouslySetInnerHTML={{ __html: item.html }} />
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ item }: { item: ReviewItem }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <div className="testimonial-avatar">{item.initial}</div>
        <div className="testimonial-meta">
          <p className="testimonial-name">{item.name}</p>
          <p className="testimonial-stars">
            {'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}
          </p>
        </div>
      </div>
      <p className="testimonial-text">{item.text}</p>
    </div>
  )
}

function TestimonialsCarousel({ data }: { data: ReviewItem[] }) {
  const [current, setCurrent] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);

  const calcPerPage = () => {
    if (window.innerWidth <= 580) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  };

  const pages = Math.ceil(data.length / perPage);

  useEffect(() => {
    const handleResize = () => {
      const pp = calcPerPage();
      setPerPage(pp);
      setCurrent(0);
    };
    window.addEventListener('resize', handleResize);
    setPerPage(calcPerPage());
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement;
    const w = card ? card.offsetWidth : 0;
    const offset = current * perPage * (w + 24);
    track.style.transform = `translateX(-${offset}px)`;
  }, [current, perPage]);

  return (
    <div>
      <div className="testimonials-carousel">
        <div className="testimonials-track" ref={trackRef}>
          {data.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>
      <div className="testimonials-pagination">
        {Array.from({ length: Math.min(5, pages) }, (_, i) => (
          <button
            key={i}
            className={`dot${current === i ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function useScrollReveal(selector: string){
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'translateY(0)'
        }
      })
    }, {threshold: 0.1});

    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity .6s ${i * 0.05}s ease, transform .6s ${i * 0.05}s ease`;
      obs.observe(el);
    })

    return () => obs.disconnect();
  }, [selector])
}

export function AboutUs() {
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/about/accordion')
      .then(res => {
          const data = res.data;
          setItems(Array.isArray(data) ? data : [])
      })
      .catch(err => console.log('sdsdssd'))
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/api/about/reviews')
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
  }, [])

  useScrollReveal('#accordionList .accordion-item, .contact-btn');

  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash])

  return (
    <div className='ab-page'>
      <title>GILDED - About Us</title>
      <Header />

      {/* <!-- HERO --> */}
      <section className="hero">
        <p className="hero-ornament">Cosmetics &amp; Beauty</p>
        <h1>About <em>Gilded</em></h1>
        <div className="hero-divider"></div>
        <p className="hero-sub">Where luxury meets artistry</p>
      </section>

      {/* <!-- ACCORDION --> */}
      <section className="accordion-section">
        <p className="accordion-section-label">Our Story &amp; Values</p>
        <div id="accordionList">
          {items.map(item => (
            <AccordionItemComp key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* <!-- TESTIMONIALS --> */}
      <section className="testimonials" id="testimonials">
        <h2 className="section-title">Testimonials</h2>
        <div className="section-rule"></div>
          <TestimonialsCarousel data={reviews}/>
      </section>

      {/* <!-- CONTACT --> */}
      <section className="contact-section" id="au-contact-section">
        <p className="contact-intro">You can contact us via:</p>
        <div className="contact-buttons">
          <a href="#" className="contact-btn">Facebook</a>
          <a href="#" className="contact-btn">Messenger</a>
          <a href="mailto:gildedsupport@gilded.com.ph" className="contact-btn">Email</a>
          <a href="#" className="contact-btn">Instagram</a>
          <a href="tel:09134545672" className="contact-btn">09134545672</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
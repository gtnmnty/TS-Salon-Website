import type { ServiceItem } from "../types/services.ts";

export const services: ServiceItem[] = [
  {
    id: 1,
    name: 'Signature Haircut & Style',
    category: 'Hair Care',
    price: '\u20B11,200',
    priceNum: 1200,
    badge: 'Most Popular',
    desc: 'A bespoke cut tailored to your face shape, finished with a luxury blowout.',
    imgs: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop'
    ],
    info: ['Style Consultation', 'Luxury Scalp Wash', 'Precision Cut', 'Blowout & Finish'],
    reviewCount: 1024,
    reviews: [
      { name: 'Sofia R.', stars: 5, date: 'Mar 2025', text: 'Absolutely stunning result. My hair has never felt this healthy and the cut is perfection.' },
      { name: 'Andrea M.', stars: 5, date: 'Feb 2025', text: 'The stylist truly listened to what I wanted. I left feeling like a completely new person.' },
      { name: 'Camille D.', stars: 4, date: 'Jan 2025', text: 'Gorgeous blowout. The salon atmosphere is so calming, I nearly fell asleep in the chair.' }
    ]
  },
  {
    id: 2,
    name: 'Deep Hydration Facial',
    category: 'Skin Care',
    price: '\u20B12,500',
    priceNum: 2500,
    badge: 'Staff Pick',
    desc: 'A 60-minute ritual restoring luminosity with marine actives and oxygen infusion.',
    imgs: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop'
    ],
    info: ['Skin Analysis', 'Enzyme Exfoliation', 'Seaweed Mask', 'Oxygen Infusion', 'SPF Finish'],
    reviewCount: 708,
    reviews: [
      { name: 'Elena V.', stars: 5, date: 'Mar 2025', text: 'The most relaxing hour of my week. My skin was literally glowing for days after.' },
      { name: 'Jasmine L.', stars: 5, date: 'Feb 2025', text: "I've tried facials at many places but this one is truly world-class. Worth every peso." }
    ]
  },
  {
    id: 3,
    name: 'Luxury Gel Manicure',
    category: 'Nail Care',
    price: '\u20B1850',
    priceNum: 850,
    badge: null,
    desc: 'Flawless nails that last up to three weeks, with premium gel polish and hand massage.',
    imgs: [
      'https://images.unsplash.com/photo-1604654894610-df490982580e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604655837204-e26aa499f4f9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604655840975-f9c2f8e1d3c1?w=800&auto=format&fit=crop'
    ],
    info: ['Nail Shaping & File', 'Cuticle Care', 'Hydrating Hand Soak', 'Long-Wear Gel Polish', 'Hand Massage'],
    reviewCount: 1018,
    reviews: [
      { name: 'Marie T.', stars: 5, date: 'Mar 2025', text: 'Perfect application, no chips after two weeks! The hand massage alone is worth it.' },
      { name: 'Trisha A.', stars: 5, date: 'Mar 2025', text: 'Lovely technicians, so gentle and precise. My nails look absolutely immaculate.' },
      { name: 'Reese O.', stars: 4, date: 'Feb 2025', text: 'Great experience overall. The color selection is amazing and the gel lasts forever.' }
    ]
  },
  {
    id: 4,
    name: 'Bridal Make Up',
    category: 'Make Up',
    price: '\u20B15,500',
    priceNum: 5500,
    badge: 'Premium',
    desc: 'All-day glamour crafted for your most important day, with airbrush finish and lash application.',
    imgs: [
      'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487412840181-f51793da6090?w=800&auto=format&fit=crop'
    ],
    info: ['Pre-Bridal Consultation', 'Skin Prep & Primer', 'Airbrush Foundation', 'Lash Application', 'Setting Spray', 'Touch-Up Kit'],
    reviewCount: 708,
    reviews: [
      { name: 'Hannah G.', stars: 5, date: 'Feb 2025', text: 'I cried happy tears when I saw myself. The team understood my vision perfectly.' },
      { name: 'Nicole B.', stars: 5, date: 'Jan 2025', text: 'Flawless, long-lasting, and absolutely stunning. My photos are breathtaking.' }
    ]
  },
  {
    id: 5,
    name: 'Balayage & Toning',
    category: 'Hair Care',
    price: '\u20B13,800',
    priceNum: 3800,
    badge: 'Trending',
    desc: 'Sun-kissed dimension with hand-painted highlights and a custom gloss toning treatment.',
    imgs: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&auto=format&fit=crop'
    ],
    info: ['Hair Consultation', 'Balayage Painting', 'Toning Gloss', 'Deep Conditioning', 'Style Finish'],
    reviewCount: 708,
    reviews: [
      { name: 'Luna P.', stars: 5, date: 'Mar 2025', text: "Best balayage I've ever had. The color looks so natural and the toning is spot on." },
      { name: 'Claire S.', stars: 5, date: 'Feb 2025', text: "I've been getting balayage for years and this is by far the best result." }
    ]
  },
  {
    id: 6,
    name: 'Pedicure & Foot Ritual',
    category: 'Nail Care',
    price: '\u20B1950',
    priceNum: 950,
    badge: null,
    desc: 'A restorative foot treatment with exfoliation, mask, and reflexology-inspired massage.',
    imgs: [
      'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570942872213-1242e82c6b20?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601740936369-2e6f7b8f5e3c?w=800&auto=format&fit=crop'
    ],
    info: ['Aromatic Foot Soak', 'Callus Removal', 'Sugar Scrub', 'Hydrating Mask', 'Foot Massage', 'Polish Finish'],
    reviewCount: 708,
    reviews: [
      { name: 'Bianca R.', stars: 5, date: 'Mar 2025', text: 'My feet have never felt softer. The massage at the end is absolutely divine.' },
      { name: 'Katrina M.', stars: 5, date: 'Feb 2025', text: 'A true ritual, not just a pedicure. I leave feeling completely renewed every time.' }
    ]
  }
];
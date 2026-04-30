import { Routes, Route } from 'react-router'
import { HomePage } from './pages/homepage/HomePage'
import { Services } from './pages/services/Service'
import { Products } from './pages/products/Products'
import { Booking } from './pages/form/Booking'
import Cart from './pages/cart/Cart'
import { Account } from './pages/account/Account'
import { AboutUs } from './pages/utilities/AboutUs'
import { Auth } from './pages/form/Auth'
import { Checkout } from './pages/form/Checkout'
import { Faqs } from './pages/utilities/Faqs'
import { HelpSupport } from './pages/utilities/HelpSupport'

import { Suspense } from 'react';

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/products" element={<Products />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<Account />} />
      <Route path="/about-us" element={<AboutUs/>}/>
      <Route path="/faqs" element={<Faqs/>}/>
      <Route path="/help" element={<HelpSupport/>}/>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App

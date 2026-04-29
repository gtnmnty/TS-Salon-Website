import { Routes, Route } from 'react-router'
import { HomePage } from './pages/homepage/HomePage'
import { Services } from './pages/services/Service'
import { Account } from './pages/account/Account'
import { AboutUs } from './pages/utilities/AboutUs'
import { Faqs } from './pages/utilities/Faqs'
import { HelpSupport } from './pages/utilities/HelpSupport'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/account" element={<Account />} />
      <Route path="/about-us" element={<AboutUs/>}/>
      <Route path="/faqs" element={<Faqs/>}/>
      <Route path="/help" element={<HelpSupport/>}/>
    </Routes>
  )
}

export default App

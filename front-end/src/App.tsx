import { Routes, Route } from 'react-router'
import { HomePage } from './pages/homepage/HomePage'
import { Services } from './pages/services/Service'
import { Account } from './pages/account/Account'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  )
}

export default App

import { useState } from 'react'
import { Routes, Route } from 'react-router'
import { HomePage } from './pages/homepage/HomePage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route index element={<HomePage />}/>
      {/* <Route index element={<ServicesPage />}/>
      <Route index element={<ProductsPage />}/>
      <Route index element={<BookPage />}/>
      <Route index element={<CartPage />}/>
      <Route index element={<AccountPage />}/> */}
    </Routes>
  )
}

export default App

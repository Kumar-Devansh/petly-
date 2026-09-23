import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import MyPets from './pages/MyPets'
import Vaccinations from './pages/Vaccinations'
import Bookings from './pages/Bookings'
import Products from './pages/Products'
import Adoption from './pages/Adoption'
import HealthTips from './pages/HealthTips'
import AIAssistant from './pages/AIAssistant'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pets" element={<MyPets />} />
            <Route path="/vaccinations" element={<Vaccinations />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/products" element={<Products />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/health-tips" element={<HealthTips />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

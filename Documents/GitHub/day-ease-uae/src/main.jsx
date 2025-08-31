import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import App from './App'
import Parking from './pages/Parking'
import Nol from './pages/Nol'
import Salik from './pages/Salik'
import Address from './pages/Address'
import Tip from './pages/Tip'
import Onboarding from './pages/Onboarding'
import './styles.css'

function Root() {
  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Navigate to="/parking" replace />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/nol" element={<Nol />} />
          <Route path="/salik" element={<Salik />} />
          <Route path="/address" element={<Address />} />
          <Route path="/tip" element={<Tip />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </App>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<Root />)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(()=>{})
  })
}


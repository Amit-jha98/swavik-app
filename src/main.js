import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Lenis from 'lenis'
import './style.css'
import App from './App.jsx'
import { AppProviders } from './context/AppProviders.jsx'

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

createRoot(document.getElementById('app')).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(BrowserRouter, null, React.createElement(AppProviders, null, React.createElement(App))),
  ),
)

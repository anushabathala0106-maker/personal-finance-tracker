import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("main.jsx loading...");
console.log("root element:", document.getElementById('root'));

const canRegisterServiceWorker =
  'serviceWorker' in navigator && ['http:', 'https:'].includes(window.location.protocol)

if (canRegisterServiceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => {
      console.warn('Service worker registration failed:', error)
    })
  })
} else if ('serviceWorker' in navigator) {
  console.info(
    'Service worker registration skipped for unsupported protocol:',
    window.location.protocol,
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log("App mounted successfully");


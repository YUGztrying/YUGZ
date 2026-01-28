import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Global LTR enforcement - prevent RTL behavior
const enforceLTR = () => {
  // Set up a MutationObserver to catch dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Apply LTR to inputs, textareas, and contentEditable elements
          if (node.matches && (
            node.matches('input:not([type="radio"]):not([type="checkbox"])') ||
            node.matches('textarea') ||
            node.matches('[contenteditable]')
          )) {
            node.dir = 'ltr'
            node.style.direction = 'ltr'
            node.style.textAlign = node.matches('[contenteditable]') ? 'left' : node.style.textAlign || 'left'
          }
          
          // Also check child elements
          node.querySelectorAll?.('input:not([type="radio"]):not([type="checkbox"]), textarea, [contenteditable]').forEach((el) => {
            el.dir = 'ltr'
            el.style.direction = 'ltr'
            if (el.matches('[contenteditable]') || el.matches('input') || el.matches('textarea')) {
              el.style.textAlign = 'left'
            }
          })
        }
      })
    })
  })

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // Also apply on page load to existing elements
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea, [contenteditable]').forEach((el) => {
      el.dir = 'ltr'
      el.style.direction = 'ltr'
      el.style.textAlign = 'left'
    })
  })
}

// Initialize LTR enforcement
enforceLTR()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

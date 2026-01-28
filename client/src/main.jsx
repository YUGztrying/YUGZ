import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { enforceLTR } from './utils/ltrForcer'

// Initialize LTR enforcement BEFORE React renders
enforceLTR()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

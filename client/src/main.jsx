import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Entrée du client React (Vite). Rentre dans `#root` et affiche `App`.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

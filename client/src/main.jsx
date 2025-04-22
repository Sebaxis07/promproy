import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Remover esta línea ya que usaremos axiosClient
// import './services/api.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

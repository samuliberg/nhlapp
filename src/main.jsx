import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import Api from './api.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Schedule /> */}
    {/* <Api /> */}
    {/* <Scores /> */}
    {/* <Api /> */}
  </StrictMode>
)

console.log('Fetching from:', window.location.origin + '/api/v1/schedule/now');
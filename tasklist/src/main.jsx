import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DataProvider from "./context/DataProvider.jsx";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>,
)

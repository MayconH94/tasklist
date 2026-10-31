import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces'
import './index.css'
import DataProvider from "./context/DataProvider.jsx";
import App from './App.jsx'
import MiniIsland from './components/MiniIsland.jsx'

const isMini = window.location.hash === '#mini'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      {isMini ? <MiniIsland /> : <App />}
    </DataProvider>
  </StrictMode>,
)

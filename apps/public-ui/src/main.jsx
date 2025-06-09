// File: apps/public-ui/src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Change this import from BrowserRouter to HashRouter
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Change this component from BrowserRouter to HashRouter */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

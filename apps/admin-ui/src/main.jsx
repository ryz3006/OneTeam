import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom'; // Changed from BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Use HashRouter for GitHub Pages compatibility */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);

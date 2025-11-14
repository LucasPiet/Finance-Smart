import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* O BrowserRouter envolve o App para prover o contexto de roteamento */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
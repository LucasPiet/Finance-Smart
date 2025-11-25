// src/App.tsx
import React from 'react';
import { AppRouter } from './router/AppRouter';
import { TransactionsProvider } from './context/TransactionContext'; // <--- Importe aqui
import './styles/styless.css';

const App: React.FC = () => {
  return (
    // Envolva o AppRouter com o Provider
    <TransactionsProvider>
      <AppRouter/>
    </TransactionsProvider>
  );
};

export default App;
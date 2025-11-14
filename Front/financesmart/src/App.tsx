import { useState } from 'react'
import React from 'react';
import { AppRouter } from './router/AppRouter';

// Importa o CSS global para todo o projeto
import './styles/styless.css';

const App: React.FC = () => {
  return (
    <AppRouter />
  );
};



export default App

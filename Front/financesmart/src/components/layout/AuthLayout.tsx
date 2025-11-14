import React from 'react';
import { Outlet } from 'react-router-dom';

// O Outlet será substituído pelo componente da rota (Login ou Cadastro)
export const AuthLayout: React.FC = () => {
  return (
    <main className="auth-container">
      <div className="auth-card">
        <Outlet />
      </div>
    </main>
  );
};
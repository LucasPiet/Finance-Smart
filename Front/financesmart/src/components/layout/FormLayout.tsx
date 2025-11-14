import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const FormLayout: React.FC = () => {
  const navigate = useNavigate();

  // Função para voltar para a página anterior
  const handleGoBack = () => {
    navigate(-1); // Volta uma página no histórico
  };

  return (
    <div className="app-screen">
      <header className="screen-header-form">
        <button className="btn-icon" onClick={handleGoBack} aria-label="Voltar">
          &lt;
        </button>
        <h1>Novo lançamento</h1>
      </header>
      <main>
        {/* O Outlet renderiza a página NovoLancamento */}
        <Outlet />
      </main>
    </div>
  );
};
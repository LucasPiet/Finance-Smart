import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

// Componentes da UI (você pode criá-los em arquivos separados)
const BalanceCard: React.FC = () => (
  <section className="balance-card">
    <h3>Balanço do mês</h3>
    {/* Lógica de estado (useState, useContext) iria aqui */}
    <p className="balance-total">R$ 0,00</p>
    <div className="balance-details">
      <div className="balance-income">
        <span>Receitas</span>
        <strong>R$ 100,00</strong>
      </div>
      <div className="balance-expense">
        <span>Despesas</span>
        <strong>R$ 100,00</strong>
      </div>
    </div>
  </section>
);

const TabsNav: React.FC = () => (
  <nav className="tabs-nav">
    <ul>
      {/* NavLink adiciona a classe "active" automaticamente */}
      <li><NavLink to="/" end>Todos</NavLink></li>
      <li><NavLink to="/receitas">Receitas</NavLink></li>
      <li><NavLink to="/despesas">Despesas</NavLink></li>
    </ul>
  </nav>
);

const BottomNav: React.FC = () => (
  <footer className="app-footer-nav">
    <button className="btn-nav-item active" aria-label="Usuário">👤</button>
    {/* O FAB agora é um Link para a rota de novo lançamento */}
    <Link to="/novo-lancamento" className="btn-fab" aria-label="Adicionar Lançamento">
      +
    </Link>
    <button className="btn-nav-item" aria-label="Menu">☰</button>
  </footer>
);

// O Layout principal que junta tudo
export const AppLayout: React.FC = () => {
  return (
    <div className="app-screen">
      <header className="screen-header">
        <button className="btn-icon" aria-label="Mês anterior">&lt;</button>
        <div className="month-selector">
          <h2>Abril/2025</h2>
        </div>
        <button className="btn-icon" aria-label="Próximo mês">&gt;</button>
        <button className="btn-icon" aria-label="Selecionar data">🗓️</button>
      </header>

      <main className="screen-content">
        <BalanceCard />
        <TabsNav />
        <section className="transactions-list">
          {/* O Outlet renderiza a página-filha (Todos, Receitas, Despesas) */}
          <Outlet />
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
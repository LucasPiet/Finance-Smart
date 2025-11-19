import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu'; // Certifique-se que o caminho está correto baseada na sua pasta

// Ícones SVG
const IconChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout efetuado");
    // CORREÇÃO: Redireciona explicitamente para login
    navigate('/login'); 
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Tem certeza que deseja apagar sua conta?")) {
      console.log("Conta apagada");
      navigate('/login');
    }
  };

  return (
    <div className="app-screen">
      <header className="screen-header">
        <button className="icon-btn" aria-label="Mês anterior"><IconChevronLeft /></button>
        <div className="month-selector">
          <h2>Abril/2025</h2>
        </div>
        <button className="icon-btn" aria-label="Próximo mês"><IconChevronRight /></button>
        <button className="icon-btn" aria-label="Selecionar data"><IconCalendar /></button>
      </header>

      <main className="screen-content">
        {/* Card de Balanço */}
        <section className="balance-card">
          <h3>Balanço do mês</h3>
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

        {/* Navegação por Abas */}
        <nav className="tabs-nav">
          <ul>
            {/* Aponta para a raiz do AppLayout, que é /dashboard */}
            <li><NavLink to="/dashboard" end>Todos</NavLink></li> 
            {/* Rotas relativas funcionam automaticamente baseadas no pai */}
            <li><NavLink to="receitas">Receitas</NavLink></li>
            <li><NavLink to="despesas">Despesas</NavLink></li>
          </ul>
        </nav>

        <section className="transactions-list">
          <Outlet />
        </section>
      </main>

      {/* Rodapé com Navegação */}
      <footer className="app-footer-nav">
        <div className="nav-item">
          <UserMenu
            userEmail="seu@email.com"
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
        <div className="nav-item">
          <Link to="/novo-lancamento" className="btn-fab" aria-label="Adicionar Lançamento">
            <IconPlus />
          </Link>
        </div>
        <div className="nav-item">
          <button className="icon-btn" aria-label="Menu">
            <IconMenu />
          </button>
        </div>
      </footer>
    </div>
  );
};
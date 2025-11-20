import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import AppMenu from '../AppMenu/AppMenu';
import { api } from '../../services/api';

// --- Ícones SVG ---
const IconChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><line x1="12" y1="5" x2="12" y2="19"></line></svg>;

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado para controlar a data selecionada (Mês/Ano)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Estado para o resumo financeiro (Saldo, Receitas, Despesas)
  const [resumo, setResumo] = useState({
    saldo: 0,
    receitas: 0,
    despesas: 0
  });

  // Carregar dados do resumo financeiro ao iniciar
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await api.getSaldo();
        setResumo({
          saldo: dados.saldo || 0,
          receitas: dados.receitas || 0,
          despesas: dados.despesas || 0
        });
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      }
    };
    carregarDados();
  }, []); // Executa uma vez na montagem do componente

  // --- Funções de Autenticação e Conta ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Tem a certeza ABSOLUTA? Esta ação apagará todos os seus lançamentos e não pode ser desfeita.")) {
      try {
        await api.deleteAccount();
        localStorage.removeItem('token');
        alert("Sua conta foi excluída com sucesso.");
        navigate('/login');
      } catch (error) {
        console.error(error);
        alert("Erro ao apagar conta. Tente novamente mais tarde.");
      }
    }
  };

  // --- Lógica de Data e Formatação ---

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);
  const displayDate = formattedDate.replace(' de ', '/').replace(/^\w/, (c) => c.toUpperCase());

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      setCurrentDate(newDate);
    }
  };

  // Formata a data para o valor do input (YYYY-MM-DD)
  const dateInputValue = currentDate.toISOString().split('T')[0];

  // Helper para formatar moeda (BRL)
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="app-screen">
      
      {/* Cabeçalho com Navegação de Datas */}
      <header className="screen-header">
        <button className="icon-btn" onClick={handlePrevMonth} aria-label="Mês anterior">
          <IconChevronLeft />
        </button>
        
        <div className="month-selector">
          <h2>{displayDate}</h2>
        </div>
        
        <button className="icon-btn" onClick={handleNextMonth} aria-label="Próximo mês">
          <IconChevronRight />
        </button>
        
        {/* Botão de Calendário com Input Nativo Sobreposto */}
        <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Ícone visual */}
          <div className="icon-btn" style={{ pointerEvents: 'none' }}>
            <IconCalendar />
          </div>
          
          {/* Input invisível mas clicável */}
          <input 
            type="date" 
            value={dateInputValue} 
            onChange={handleDateSelect} 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              opacity: 0, 
              cursor: 'pointer',
              zIndex: 10 
            }} 
          />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="screen-content">
        
        {/* Card de Balanço */}
        <section className="balance-card">
          <h3>Balanço total</h3>
          <p className="balance-total" style={{ color: resumo.saldo < 0 ? 'var(--color-negative)' : 'inherit' }}>
            {formatMoney(resumo.saldo)}
          </p>
          
          <div className="balance-details">
            <div className="balance-income">
              <span>Receitas</span>
              <strong style={{ color: 'var(--color-positive)' }}>{formatMoney(resumo.receitas)}</strong> 
            </div>
            <div className="balance-expense">
              <span>Despesas</span>
              <strong style={{ color: 'var(--color-negative)' }}>{formatMoney(resumo.despesas)}</strong> 
            </div>
          </div>
        </section>

        {/* Navegação por Abas */}
        <nav className="tabs-nav">
          <ul>
            <li><NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>Todos</NavLink></li> 
            <li><NavLink to="receitas" className={({ isActive }) => isActive ? 'active' : ''}>Receitas</NavLink></li>
            <li><NavLink to="despesas" className={({ isActive }) => isActive ? 'active' : ''}>Despesas</NavLink></li>
          </ul>
        </nav>

        {/* Lista de Transações (Renderizada pelas rotas filhas) */}
        <section className="transactions-list">
          <Outlet context={{ currentDate }} />
        </section>
      </main>

      {/* Rodapé de Navegação */}
      <footer className="app-footer-nav">
        <div className="nav-item">
          <UserMenu 
            userEmail="Minha Conta" 
            onLogout={handleLogout} 
            onDeleteAccount={handleDeleteAccount} 
          />
        </div>
        <div className="nav-item">
          <Link to="/novo-lancamento" className="btn-fab" aria-label="Novo Lançamento">
            <IconPlus />
          </Link>
        </div>
        <div className="nav-item">
          <AppMenu />
        </div>
      </footer>
    </div>
  );
};
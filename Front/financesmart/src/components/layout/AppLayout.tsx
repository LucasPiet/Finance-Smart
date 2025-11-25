import React, { useState, useRef } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import AppMenu from '../AppMenu/AppMenu';

// Importação do Contexto para acessar as transações
// Certifique-se de que o arquivo TransactionsContext.tsx existe em src/context/
import { useTransactions } from '../../context/TransactionContext';

// --- Ícones SVG ---
const IconChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><line x1="12" y1="5" x2="12" y2="19"></line></svg>;

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Estado para controlar a Data Atual
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 2. Referência para o input de data invisível
  const dateInputRef = useRef<HTMLInputElement>(null);

  // 3. RECUPERANDO AS TRANSAÇÕES DO CONTEXTO
  const { transactions } = useTransactions();

  // --- Lógica de Cálculos ---
  
  // Filtra as transações que pertencem ao mês e ano selecionados
  const filteredTransactions = transactions.filter(t => {
    // Cria a data da transação ajustando o fuso (adicionando T00:00:00 para evitar problemas de UTC)
    const tDate = new Date(t.date + 'T00:00:00');
    return tDate.getMonth() === currentDate.getMonth() &&
           tDate.getFullYear() === currentDate.getFullYear();
  });

  // Calcula o total de receitas (income)
  const incomeTotal = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  // Calcula o total de despesas (expense)
  const expenseTotal = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // Balanço final
  const balanceTotal = incomeTotal - expenseTotal;

  // Formatação de moeda (R$)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // --- Lógica de Navegação e Data ---

  const handleLogout = () => {
    console.log("Logout efetuado");
    navigate('/login'); 
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Tem certeza que deseja apagar sua conta?")) {
      console.log("Conta apagada");
      navigate('/login');
    }
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  }).format(currentDate);
  
  const displayDate = formattedDate
    .replace(' de ', '/')
    .replace(/^\w/, (c) => c.toUpperCase());

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

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      if ('showPicker' in dateInputRef.current) {
        (dateInputRef.current as any).showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      setCurrentDate(newDate);
    }
  };

  const dateInputValue = currentDate.toISOString().split('T')[0];

  return (
    <div className="app-screen">
      <header className="screen-header">
        
        {/* Botão Anterior */}
        <button className="icon-btn" aria-label="Mês anterior" onClick={handlePrevMonth}>
          <IconChevronLeft />
        </button>
        
        <div className="month-selector">
          <h2>{displayDate}</h2>
        </div>

        {/* Botão Próximo */}
        <button className="icon-btn" aria-label="Próximo mês" onClick={handleNextMonth}>
          <IconChevronRight />
        </button>

        {/* Botão Calendário e Input Invisível */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" aria-label="Selecionar data" onClick={handleCalendarClick}>
            <IconCalendar />
          </button>
          
          <input 
            type="date" 
            ref={dateInputRef}
            value={dateInputValue}
            onChange={handleDateSelect}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              opacity: 0, 
              pointerEvents: 'none' 
            }}
          />
        </div>

      </header>

      <main className="screen-content">
        <section className="balance-card">
          <h3>Balanço do mês</h3>
          {/* Exibe o Balanço Calculado com cor dinâmica */}
          <p 
            className="balance-total"
            style={{ color: balanceTotal < 0 ? 'var(--color-negative)' : 'var(--color-text)' }}
          >
            {formatCurrency(balanceTotal)}
          </p>

          <div className="balance-details">
            <div className="balance-income">
              <span>Receitas</span>
              {/* Exibe o Total de Receitas Calculado */}
              <strong>{formatCurrency(incomeTotal)}</strong> 
            </div>
            <div className="balance-expense">
              <span>Despesas</span>
              {/* Exibe o Total de Despesas Calculado */}
              <strong>{formatCurrency(expenseTotal)}</strong> 
            </div>
          </div>
        </section>

        <nav className="tabs-nav">
          <ul>
            <li><NavLink to="/dashboard" end>Todos</NavLink></li> 
            <li><NavLink to="receitas">Receitas</NavLink></li>
            <li><NavLink to="despesas">Despesas</NavLink></li>
          </ul>
        </nav>

        <section className="transactions-list">
          {/* Passamos o contexto de data e as transações filtradas para as rotas filhas, se necessário */}
          <Outlet context={{ currentDate, filteredTransactions }} /> 
        </section>
      </main>

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
          <AppMenu />
        </div>
      </footer>
    </div>
  );
};
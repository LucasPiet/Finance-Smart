// src/pages/NovoLancamento.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext'; // <--- Importe o hook

const NovoLancamento: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions(); // <--- Pegue a função de adicionar
  
  const [type, setType] = useState<'expense' | 'income'>('expense');
  // Estados para os campos do formulário
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const isExpense = type === 'expense';
  
  // Tema dinâmico (mantido do seu código original)
  const theme = {
    color: isExpense ? 'var(--color-negative)' : 'var(--color-positive)',
    dateLabel: isExpense ? 'Data de vencimento' : 'Data de recebimento',
    descPlaceholder: isExpense ? 'Ex: Conta de Luz' : 'Ex: Salário',
    catPlaceholder: isExpense ? 'Ex: Moradia' : 'Ex: Trabalho'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converte o valor string para numero (ex: "100" -> 100)
    // Nota: Em uma app real, você precisaria tratar formatação de moeda (R$) aqui
    const numericAmount = parseFloat(amount.replace('R$', '').replace('.', '').replace(',', '.'));

    if (!date || !description || isNaN(numericAmount)) {
      alert("Preencha todos os campos corretamente");
      return;
    }

    addTransaction({
      description,
      amount: numericAmount,
      type,
      category,
      date,
    });

    console.log(`Salvo: ${description} - R$ ${numericAmount}`);
    navigate('/dashboard');
  };

  return (
    <>
      <nav className="tabs-nav-form">
         {/* ... (Seu código de abas mantém igual) ... */}
         <ul>
          <li><a href="#" className={isExpense ? 'active' : ''} onClick={() => setType('expense')}>Despesa</a></li>
          <li><a href="#" className={!isExpense ? 'active' : ''} onClick={() => setType('income')}>Receita</a></li>
        </ul>
      </nav>

      <form id="new-transaction-form" onSubmit={handleSubmit}>
        <div className="form-group-amount">
          <label htmlFor="amount">Valor</label>
          <input 
            type="number" // Mudado para number para facilitar teste rápido
            id="amount" 
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ color: theme.color }} 
          />
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input 
              type="text" 
              id="description" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={theme.descPlaceholder} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <input 
              type="text" 
              id="category" 
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder={theme.catPlaceholder} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="due-date">{theme.dateLabel}</label>
            <input 
              type="date" 
              id="due-date" 
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          
          {/* ... (Campos de repetição mantidos iguais) ... */}
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default NovoLancamento;
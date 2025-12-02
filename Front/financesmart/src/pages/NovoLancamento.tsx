import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const NovoLancamento: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [loading, setLoading] = useState(false);
  
  // Estados dos inputs
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  
  // --- ALTERAÇÃO: Novo estado para armazenar a data selecionada ---
  // Inicializa com a data de hoje no formato YYYY-MM-DD
  const [dataOperacao, setDataOperacao] = useState(new Date().toISOString().split('T')[0]);
  
  const isExpense = type === 'expense';

  // Configuração dinâmica de cores e textos
  const theme = {
    color: isExpense ? 'var(--color-negative)' : 'var(--color-positive)', 
    dateLabel: isExpense ? 'Data de vencimento' : 'Data de recebimento',
    descPlaceholder: isExpense ? 'Ex: Conta de Luz' : 'Ex: Salário',
    catPlaceholder: isExpense ? 'Ex: Moradia' : 'Ex: Trabalho'
  };

  const handleTabChange = (e: React.MouseEvent<HTMLButtonElement>, newType: 'expense' | 'income') => {
    e.preventDefault(); 
    setType(newType);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const valorLimpo = valor.replaceAll('.', '').replaceAll(',', '.');
    const valorNumerico = Number.parseFloat(valorLimpo);

    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("Por favor, insira um valor válido.");
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        tipo: isExpense ? 'D' : 'C',
        categoria: categoria, 
        descricao: descricao, 
        valor: valorNumerico,
        // --- ALTERAÇÃO: Enviando a data selecionada para a API ---
        data: dataOperacao 
      };

      await api.criarTransacao(payload);
      
      console.log(`Salvando ${type}...`);
      navigate('/dashboard');
    
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar transação. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="tabs-nav-form">
        <ul> 
          <li> 
            <button 
              type="button"
              className={isExpense ? 'active' : ''} 
              onClick={(e) => handleTabChange(e, 'expense')}
            >
              Despesa
            </button>
          </li>
          <li>
            <button 
              type="button"
              className={isExpense ? '' : 'active'} 
              onClick={(e) => handleTabChange(e, 'income')}
            >
              Receita
            </button>
          </li>
        </ul>
      </nav>

      <form id="new-transaction-form" onSubmit={handleSubmit}>
        <div className="form-group-amount">
          <label htmlFor="amount">Valor</label>
          <input 
            type="number" 
            step="0.01"
            id="amount" 
            placeholder="0,00"
            required
            style={{ color: theme.color, transition: 'color 0.3s ease' }} 
            value={valor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValor(e.target.value)}
          />
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input 
              type="text" 
              id="description" 
              placeholder={theme.descPlaceholder} 
              required
              value={descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <input 
              type="text" 
              id="category" 
              placeholder={theme.catPlaceholder} 
              required
              value={categoria}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoria(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="due-date">{theme.dateLabel}</label>
            {/* --- ALTERAÇÃO: Adicionado value e onChange para controlar o input de data --- */}
            <input 
              type="date" 
              id="due-date" 
              required
              value={dataOperacao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDataOperacao(e.target.value)}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default NovoLancamento;
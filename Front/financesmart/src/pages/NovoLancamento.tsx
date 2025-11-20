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
  
  const isExpense = type === 'expense';

  // Configuração dinâmica de cores e textos
  const theme = {
    color: isExpense ? 'var(--color-negative)' : 'var(--color-positive)', // Vermelho ou Verde
    dateLabel: isExpense ? 'Data de vencimento' : 'Data de recebimento',
    descPlaceholder: isExpense ? 'Ex: Conta de Luz' : 'Ex: Salário',
    catPlaceholder: isExpense ? 'Ex: Moradia' : 'Ex: Trabalho'
  };

  // Função para trocar a aba de forma segura
  const handleTabChange = (e: React.MouseEvent, newType: 'expense' | 'income') => {
    e.preventDefault(); // Impede o comportamento padrão do link
    setType(newType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Converter valor de string (ex: "1.000,50") para float
    // Remove pontos de milhar e troca vírgula decimal por ponto
    const valorLimpo = valor.replace(/\./g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorLimpo);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("Por favor, insira um valor válido.");
      setLoading(false);
      return;
    }

    try {
      await api.criarTransacao({
        tipo: isExpense ? 'D' : 'C', // D = Despesa, C = Receita (Crédito)
        categoria: categoria,
        descricao: descricao,
        valor: valorNumerico
      });

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
            <a 
              href="#" 
              className={isExpense ? 'active' : ''} 
              onClick={(e) => handleTabChange(e, 'expense')}
            >
              Despesa
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={!isExpense ? 'active' : ''} 
              onClick={(e) => handleTabChange(e, 'income')}
            >
              Receita
            </a>
          </li>
        </ul>
      </nav>

      <form id="new-transaction-form" onSubmit={handleSubmit}>
        <div className="form-group-amount">
          <label htmlFor="amount">Valor</label>
          {/* O estilo inline aqui garante a cor dinâmica */}
          <input 
            type="number" 
            step="0.01"
            id="amount" 
            placeholder="0,00"
            required
            style={{ color: theme.color, transition: 'color 0.3s ease' }} 
            value={valor}
            onChange={(e) => setValor(e.target.value)}
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
              onChange={(e) => setDescricao(e.target.value)}
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
              onChange={(e) => setCategoria(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="due-date">{theme.dateLabel}</label>
            <input type="date" id="due-date" defaultValue={new Date().toISOString().split('T')[0]} />
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
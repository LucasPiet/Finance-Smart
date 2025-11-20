import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovoLancamento: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  
  const isExpense = type === 'expense';

  // Configurações dinâmicas baseadas no tipo (limpa o JSX)
  const theme = {
    color: isExpense ? 'var(--color-negative)' : 'var(--color-positive)',
    dateLabel: isExpense ? 'Data de vencimento' : 'Data de recebimento',
    descPlaceholder: isExpense ? 'Ex: Conta de Luz' : 'Ex: Salário',
    catPlaceholder: isExpense ? 'Ex: Moradia' : 'Ex: Trabalho'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Salvando ${type}...`);
    navigate('/dashboard');
  };

  return (
    <>
      <nav className="tabs-nav-form">
        <ul>
          <li>
            <a href="#" className={isExpense ? 'active' : ''} onClick={() => setType('expense')}>
              Despesa
            </a>
          </li>
          <li>
            <a href="#" className={!isExpense ? 'active' : ''} onClick={() => setType('income')}>
              Receita
            </a>
          </li>
        </ul>
      </nav>

      <form id="new-transaction-form" onSubmit={handleSubmit}>
        <div className="form-group-amount">
          <label htmlFor="amount">Valor</label>
          <input 
            type="text" 
            id="amount" 
            defaultValue="R$ 0,00" 
            style={{ color: theme.color }} 
          />
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input type="text" id="description" placeholder={theme.descPlaceholder} />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <input type="text" id="category" placeholder={theme.catPlaceholder} />
          </div>
          
          <div className="form-group">
            <label htmlFor="due-date">{theme.dateLabel}</label>
            <input type="date" id="due-date" />
          </div>
          
          <fieldset className="form-group-toggle">
            <input type="radio" id="repeat-no" name="repeat" value="no" defaultChecked />
            <label htmlFor="repeat-no" className="btn-toggle">Não repetir</label>
            
            <input type="radio" id="repeat-always" name="repeat" value="always" />
            <label htmlFor="repeat-always" className="btn-toggle">Mensal</label>
            
            <input type="radio" id="repeat-installments" name="repeat" value="installments" />
            <label htmlFor="repeat-installments" className="btn-toggle">Parcelado</label>
          </fieldset>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default NovoLancamento;
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
  const handleTabChange = (e: React.MouseEvent<HTMLButtonElement>, newType: 'expense' | 'income') => {
    e.preventDefault(); // Impede o comportamento padrão do botão (seguro ao usar como link)
    setType(newType);
  };
// Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Impede o comportamento padrão do formulário
    e.preventDefault();
    // Verifica se os campos estão preenchidos
    setLoading(true);

    // Converter valor de string (ex: "1.000,50") para float
    // Remove pontos de milhar e troca vírgula decimal por ponto
    const valorLimpo = valor.replaceAll('.', '').replaceAll(',', '.');
    // Converte para número
    // Verifica se o valor é um número válido
    const valorNumerico = Number.parseFloat(valorLimpo);
    // Se o valor não for um número válido ou for menor ou igual a zero, exibe um alerta
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      // Exibe um alerta se o valor for inválido
      alert("Por favor, insira um valor válido.");
      // Reseta o estado de loading
      setLoading(false);
      return;
    }
    // Verifica se os campos obrigatórios estão preenchidos
    try {
      // Se os campos obrigatórios estiverem preenchidos, cria o payload
      const payload: any = {
        tipo: isExpense ? 'D' : 'C', // D = Despesa, C = Receita (Crédito)
        categoria: categoria, // Categoria da transação
        descricao: descricao, // Descrição da transação
        valor: valorNumerico // Valor da transação convertido para número
      };
      // Se a data de vencimento for fornecida, adiciona ao payload
      await api.criarTransacao(payload);
      // Exibe uma mensagem de sucesso e redireciona para o dashboard
      console.log(`Salvando ${type}...`);
      // Exibe um alerta de sucesso
      navigate('/dashboard');
      // Redireciona para a página de dashboard
    } catch (error) {
      // Se ocorrer um erro, exibe uma mensagem de erro
      console.error("Erro ao salvar:", error);
      // Exibe um alerta de erro
      alert("Erro ao salvar transação. Verifique a conexão.");
      // Reseta o estado de loading
    } finally {
      // Reseta o estado de loading independentemente do resultado
      setLoading(false);
      // Reseta os campos do formulário
    }
  };

  return (
    <>
      {/* Renderiza o formulário de novo lançamento */}
      <nav className="tabs-nav-form">
        {/*Renderiza as abas para selecionar entre Despesa e Receita*/}
        <ul> {/* Lista de abas
          * Cada aba é um botão que altera o estado do tipo de transação */}
          <li> {/* Aba para Despesa */}
            <button {/* Botão para selecionar Despesa */}
              type="button"
              className={isExpense ? 'active' : ''} {/* Classe ativa se for Despesa */}
              onClick={(e) => handleTabChange(e, 'expense')}{/* Altera o estado para Despesa */}
            >
              Despesa
            </button>
          </li>{/* Aba para Receita */}
          <li>{/* Botão para selecionar Receita */}
            <button 
              type="button"
              className={isExpense ? '' : 'active'} 
              onClick={(e) => handleTabChange(e, 'income')}{/* Altera o estado para Receita */}
            >
              Receita
            </button>
          </li>
        </ul>
      </nav>

      <form id="new-transaction-form" onSubmit={handleSubmit}>{/* Formulário para novo lançamento*/}
       {/* Renderiza o título do formulário */}
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
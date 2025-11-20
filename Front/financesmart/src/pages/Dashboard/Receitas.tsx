import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../services/api';

interface DashboardContext {
  currentDate: Date;
}

// Interface atualizada (Minúsculas)
interface Transacao {
  id: number;
  tipo: string;
  categoria: string;
  descricao: string;
  valor: number;
  data_transacao: string;
}

const Receitas: React.FC = () => {
  const { currentDate } = useOutletContext<DashboardContext>();
  
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const lista = await api.getTransacoes();
        setTransacoes(lista);
      } catch (error) {
        console.error("Erro ao carregar receitas:", error);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  // Filtro corrigido (chaves minúsculas e correção de data)
  const receitas = transacoes.filter(t => {
    if (!t.data_transacao) return false;

    const dataString = t.data_transacao.replace(' ', 'T');
    const dataTransacao = new Date(dataString);

    if (isNaN(dataTransacao.getTime())) return false;

    return (
      t.tipo === 'C' && // 'tipo' minúsculo
      dataTransacao.getMonth() === currentDate.getMonth() &&
      dataTransacao.getFullYear() === currentDate.getFullYear()
    );
  });

  if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Carregando...</div>;

  if (receitas.length === 0) {
    return (
      <div className="empty-state">
        <p>Não há receitas neste mês.</p>
      </div>
    );
  }

  return (
    <>
      {receitas.map((item) => (
        <article key={item.id} className="transaction-item income">
          <div className="item-icon">💰</div>
          <div className="item-details">
            {/* Usando chaves minúsculas: descricao, categoria */}
            <strong>{item.descricao || item.categoria}</strong>
            <span>
              {new Date(item.data_transacao.replace(' ', 'T')).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="item-amount">
            <span className="positive">
              {/* Usando chave minúscula: valor */}
              + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
            </span>
            <small>{item.categoria}</small>
          </div>
        </article>
      ))}
    </>
  );
};

export default Receitas;
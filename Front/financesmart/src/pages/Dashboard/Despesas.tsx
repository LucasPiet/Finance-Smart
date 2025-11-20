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

const Despesas: React.FC = () => {
  const { currentDate } = useOutletContext<DashboardContext>();
  
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const lista = await api.getTransacoes();
        setTransacoes(lista);
      } catch (error) {
        console.error("Erro ao carregar despesas:", error);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  // Filtro corrigido
  const despesas = transacoes.filter(t => {
    if (!t.data_transacao) return false;

    const dataString = t.data_transacao.replace(' ', 'T');
    const dataTransacao = new Date(dataString);

    if (isNaN(dataTransacao.getTime())) return false;

    return (
      t.tipo === 'D' && // 'tipo' minúsculo
      dataTransacao.getMonth() === currentDate.getMonth() &&
      dataTransacao.getFullYear() === currentDate.getFullYear()
    );
  });

  if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Carregando...</div>;

  if (despesas.length === 0) {
    return (
      <div className="empty-state">
        <p>Não há despesas neste mês.</p>
      </div>
    );
  }

  return (
    <>
      {despesas.map((item) => (
        <article key={item.id} className="transaction-item expense">
          <div className="item-icon">🛑</div>
          <div className="item-details">
            <strong>{item.descricao || item.categoria}</strong>
            <span>
              {new Date(item.data_transacao.replace(' ', 'T')).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="item-amount">
            <span className="negative">
              - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
            </span>
            <small>{item.categoria}</small>
          </div>
        </article>
      ))}
    </>
  );
};

export default Despesas;
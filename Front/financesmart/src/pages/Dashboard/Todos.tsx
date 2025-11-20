import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../services/api';

interface DashboardContext {
  currentDate: Date;
}

interface Transacao {
  id: number;
  tipo: string;
  categoria: string;
  descricao: string;
  valor: number;
  data_transacao: string;
}

const Todos: React.FC = () => {
  const { currentDate } = useOutletContext<DashboardContext>();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para Edição (Modal)
  const [editingItem, setEditingItem] = useState<Transacao | null>(null);
  const [editForm, setEditForm] = useState({ descricao: '', valor: '', tipo: 'D', categoria: '' });

  // Carregar Dados
  const carregarTransacoes = async () => {
    setLoading(true);
    try {
      const lista = await api.getTransacoes();
      setTransacoes(lista);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  // --- FUNÇÃO DELETAR ---
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem a certeza que deseja apagar esta transação?")) {
      try {
        await api.deleteTransacao(id);
        // Remove da lista localmente para não precisar recarregar tudo
        setTransacoes(prev => prev.filter(item => item.id !== id));
        // Opcional: Recarregar saldo (pode forçar refresh da página ou usar contexto global)
        window.location.reload(); 
      } catch (error) {
        alert("Erro ao apagar item.");
      }
    }
  };

  // --- FUNÇÕES DE EDIÇÃO ---
  const handleEditClick = (item: Transacao) => {
    setEditingItem(item);
    setEditForm({
      descricao: item.descricao || '',
      valor: item.valor.toString(),
      tipo: item.tipo,
      categoria: item.categoria
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await api.updateTransacao(editingItem.id, {
        tipo: editForm.tipo as 'C' | 'D',
        categoria: editForm.categoria,
        descricao: editForm.descricao,
        valor: parseFloat(editForm.valor)
      });
      
      setEditingItem(null); // Fecha modal
      window.location.reload(); // Recarrega para atualizar saldo e lista
    } catch (error) {
      alert("Erro ao atualizar transação.");
    }
  };

  // Filtro de Data
  const transacoesFiltradas = transacoes.filter(t => {
    if (!t.data_transacao) return false;
    const dataString = t.data_transacao.replace(' ', 'T');
    const dataTransacao = new Date(dataString);
    if (isNaN(dataTransacao.getTime())) return false;

    return (
      dataTransacao.getMonth() === currentDate.getMonth() &&
      dataTransacao.getFullYear() === currentDate.getFullYear()
    );
  });

  if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Carregando...</div>;

  return (
    <>
      {/* LISTA DE TRANSAÇÕES */}
      {transacoesFiltradas.length === 0 ? (
        <div className="empty-state"><p>Nenhuma transação neste mês.</p></div>
      ) : (
        transacoesFiltradas.map((item) => (
          <article 
            key={item.id} 
            className={`transaction-item ${item.tipo === 'D' ? 'expense' : 'income'}`}
            style={{ position: 'relative', paddingRight: '80px' }} // Espaço para botões
          >
            <div className="item-icon">{item.tipo === 'D' ? '🛑' : '💰'}</div>
            
            <div className="item-details">
              <strong>{item.descricao || item.categoria}</strong>
              <span>{new Date(item.data_transacao.replace(' ', 'T')).toLocaleDateString('pt-BR')}</span>
            </div>
            
            <div className="item-amount">
              <span className={item.tipo === 'D' ? 'negative' : 'positive'}>
                {item.tipo === 'D' ? '- ' : '+ '}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
              </span>
              <small>{item.categoria}</small>
            </div>

            {/* BOTÕES DE AÇÃO (Editar / Excluir) */}
            <div style={{ position: 'absolute', right: '10px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleEditClick(item)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Editar"
              >
                ✏️
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Excluir"
              >
                🗑️
              </button>
            </div>
          </article>
        ))
      )}

      {/* MODAL DE EDIÇÃO SIMPLES */}
      {editingItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleSaveEdit} style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '400px',
            display: 'flex', flexDirection: 'column', gap: '15px'
          }}>
            <h3>Editar Transação</h3>
            
            {/* Trocar Tipo (Gerenciar Receita/Despesa) */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => setEditForm({...editForm, tipo: 'D'})}
                className={editForm.tipo === 'D' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc' }}
              >
                Despesa
              </button>
              <button 
                type="button"
                onClick={() => setEditForm({...editForm, tipo: 'C'})}
                className={editForm.tipo === 'C' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', backgroundColor: editForm.tipo === 'C' ? 'var(--color-positive)' : '' }}
              >
                Receita
              </button>
            </div>

            <div>
              <label>Valor</label>
              <input 
                type="number" 
                step="0.01" 
                value={editForm.valor} 
                onChange={e => setEditForm({...editForm, valor: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Descrição</label>
              <input 
                type="text" 
                value={editForm.descricao} 
                onChange={e => setEditForm({...editForm, descricao: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Categoria</label>
              <input 
                type="text" 
                value={editForm.categoria} 
                onChange={e => setEditForm({...editForm, categoria: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '10px', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Todos;
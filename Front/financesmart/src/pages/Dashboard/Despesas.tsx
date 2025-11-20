import React from 'react';

const Despesas: React.FC = () => {
  // Lógica de estado para verificar se há despesas
  const temDespesas = true; // Mude para false para ver o estado vazio

  return (
    <>
      {temDespesas ? (
        <article className="transaction-item expense">
          <div className="item-icon">🕒</div>
          <div className="item-details">
            <strong>Despesa teste</strong>
            <span>23/05/2025</span>
          </div>
          <div className="item-amount">
            <span className="negative">- R$ 100,00</span>
            <small>1/2</small>
          </div>
        </article>
      ) : (
        <div className="empty-state">
          <p>Não há despesas cadastradas neste mês</p>
          <button className="btn-secondary">Cadastrar despesa</button>
        </div>
      )}
    </>
  );
};

export default Despesas;
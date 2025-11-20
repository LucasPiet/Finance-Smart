import React from 'react';

const Receitas: React.FC = () => {
  // Lógica de estado para verificar se há receitas
  const temReceitas = true; // Mude para false para ver o estado vazio

  return (
    <>
      {temReceitas ? (
        <article className="transaction-item income">
          <div className="item-icon">🕒</div>
          <div className="item-details">
            <strong>Receita teste</strong>
            <span>23/05/2025</span>
          </div>
          <div className="item-amount">
            <span className="positive">+ R$ 100,00</span>
            <small>1/2</small>
          </div>
        </article>
      ) : (
        <div className="empty-state">
          <p>Não há receitas cadastradas neste mês</p>
          <button className="btn-secondary">Cadastrar receitas</button>
        </div>
      )}
    </>
  );
};

export default Receitas;
import React from 'react';

const Todos: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default Todos;
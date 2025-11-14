import React from 'react';

const NovoLancamento: React.FC = () => {
  return (
    <>
      <nav className="tabs-nav-form">
        <ul>
          <li><a href="#" className="active">Despesa</a></li>
          <li><a href="#">Receita</a></li>
        </ul>
      </nav>

      <form id="new-transaction-form">
        <div className="form-group-amount">
          <label htmlFor="amount">Valor</label>
          <input type="text" id="amount" defaultValue="R$ 0,00" />
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input type="text" id="description" placeholder="Descrição" />
          </div>
          
          <div className="form-group">
            <label htmlFor="due-date">Data de vencimento</label>
            <input type="text" id="due-date" defaultValue="23/04/2025" />
          </div>
          
          <fieldset className="form-group-toggle">
            <input type="radio" id="repeat-no" name="repeat" value="no" defaultChecked />
            <label htmlFor="repeat-no" className="btn-toggle">Não repetir</label>
            
            <input type="radio" id="repeat-always" name="repeat" value="always" />
            <label htmlFor="repeat-always" className="btn-toggle">Sempre</label>
            
            <input type="radio" id="repeat-installments" name="repeat" value="installments" />
            <label htmlFor="repeat-installments" className="btn-toggle">Parcelado</label>
          </fieldset>
          
          <button type="submit" className="btn-primary">Salvar</button>
        </div>
      </form>
    </>
  );
};

export default NovoLancamento;
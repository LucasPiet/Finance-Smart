import React from 'react';
import { Link } from 'react-router-dom';

const Cadastro: React.FC = () => {
  return (
    <>
      <header className="auth-header">
        <h1>Cadastre-se!</h1>
        <p>Crie sua conta para acessar o aplicativo</p>
      </header>

      <form id="register-form">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="Digite seu e-mail" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" placeholder="Digite seu nome" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password-confirm">Confirmação de senha</label>
          <input type="password" id="password-confirm" placeholder="Confirme sua senha" required />
        </div>
        
        <button type="submit" className="btn-primary">Cadastre-se</button>
      </form>
      
      <Link to="/login" className="auth-link">
        Já tenho cadastro
      </Link>
    </>
  );
};

export default Cadastro;
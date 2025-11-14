import React from 'react';

const Login: React.FC = () => {
  return (
    <>
      <header className="auth-header">
        <h1>Bem-vindo!</h1>
        <p>Faça login para acessar o aplicativo.</p>
      </header>
      
      <form id="login-form">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="Digite seu e-mail" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" required />
        </div>
        
        <a href="#" className="forgot-password">Esqueci minha senha</a>
        
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
    </>
  );
};

export default Login;
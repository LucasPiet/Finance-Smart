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
        
        <a href="/cadastro" className="forgot-password-link">Não tem uma conta? Cadastre-se</a>
        
        <a className="btn-primary" href="/dashboard/todos">Entrar</a>
        
      </form>
    </>
  );
};

export default Login;
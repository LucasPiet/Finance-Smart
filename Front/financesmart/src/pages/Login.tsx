import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

const Login: React.FC = () => {
  const navigate = useNavigate(); 
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login efetuado com sucesso (simulado).");
    
    // CORREÇÃO: Redireciona para a rota principal do painel
    navigate('/dashboard'); 
  };

  return (
    <>
      <header className="auth-header">
        <h1>Bem-vindo!</h1>
        <p>Faça login para acessar o aplicativo.</p>
      </header>
      
      <form id="login-form" onSubmit={handleSubmit}> 
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="Digite seu e-mail" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" required />
        </div>
        
        <Link to="/alterar-senha" className="forgot-password">
          Esqueci minha senha
        </Link>
        
        <button type="submit" className="btn-primary">Entrar</button>
      </form>

      <Link to="/cadastro" className="auth-link">
        Não tem conta? Cadastre-se
      </Link>
    </>
  );
};

export default Login;
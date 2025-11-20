import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { api } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate(); 
  
  // Estados para os inputs e feedback visual
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');      // Limpa erros anteriores
    setLoading(true); // Ativa estado de carregamento

    try {
      // 1. Chama a API de Login
      const data = await api.login({ email, senha });
      
      // 2. Salva o token recebido no armazenamento do navegador
      localStorage.setItem('token', data.token);
      
      console.log("Login efetuado com sucesso.");
      
      // 3. Redireciona para o Dashboard
      navigate('/dashboard'); 
      
    } catch (err: any) {
      console.error(err);
      // Exibe mensagem de erro amigável
      setErro(err.message || "Falha ao fazer login. Verifique e-mail e senha.");
    } finally {
      setLoading(false); // Desativa estado de carregamento
    }
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
          <input 
            type="email" 
            id="email" 
            placeholder="Digite seu e-mail" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Digite sua senha" 
            required 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        
        {/* Exibição de Erro (se houver) */}
        {erro && (
          <p style={{ 
            color: 'var(--color-negative)', 
            marginBottom: '15px', 
            textAlign: 'center', 
            fontSize: '0.9rem' 
          }}>
            {erro}
          </p>
        )}
        
        {/* Link atualizado para a nova tela de solicitação de e-mail */}
        <Link to="/esqueci-senha" className="forgot-password">
          Esqueci minha senha
        </Link>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <Link to="/cadastro" className="auth-link">
        Não tem conta? Cadastre-se
      </Link>
    </>
  );
};

export default Login;
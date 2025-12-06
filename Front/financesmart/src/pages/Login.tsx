import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { api } from '../services/api';
import eyeOpenImg from '../assets/openEye.jpg'; 
import eyeClosedImg from '../assets/closedEye.jpg';
import logo from '../assets/logo.png'; 

const Login: React.FC = () => {
  const navigate = useNavigate(); 
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const data = await api.login({ email, senha });
      localStorage.setItem('token', data.token);
      console.log("Login efetuado com sucesso.");
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error(err);
      setErro(err.message || "Falha ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="auth-header">
        <img src= {logo} alt="" style={{ width: '50%', height: '50%', objectFit: 'contain' }}/>
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
          
          <div className="password-wrapper">
            <input 
          
              type={showPassword ? "text" : "password"} 
              id="password" 
              placeholder="Digite sua senha" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            
            <button 
              type="button" 
              className="btn-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
            
              <img 
                src={showPassword ? eyeOpenImg : eyeClosedImg} 
                alt="Ver senha"
                style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
              />
            </button>
          </div>
        </div>
        
        {erro && (
          <p style={{ color: 'var(--color-negative)', textAlign: 'center', marginBottom: '15px' }}>
            {erro}
          </p>
        )}
        
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
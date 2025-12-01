import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { api } from '../services/api';

// Certifique-se que os caminhos das imagens estão corretos
import eyeOpenImg from '../assets/openEye.jpg'; 
import eyeClosedImg from '../assets/closedEye.jpg';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  
  // Estados de visibilidade das senhas
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await api.register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });
      
      alert("Cadastro realizado com sucesso! Faça login.");
      navigate('/login'); 

    } catch (err: any) {
      console.error("Erro no registro:", err);
      
      // --- TRATATIVA DE ERRO DE DUPLICIDADE ---
      
      // Tenta pegar a mensagem de erro de vários lugares possíveis
      // (depende de como sua API/Axios retorna o erro)
      const mensagemErro = err.response?.data?.message || err.message || JSON.stringify(err);

      // Verifica se a mensagem contém as chaves do erro SQL Server (23000 ou 2627 ou 'duplicate key')
      if (
        mensagemErro.includes("Violation of UNIQUE KEY") || 
        mensagemErro.includes("Cannot insert duplicate key") ||
        mensagemErro.includes("2627") // Código de erro SQL Server para duplicidade
      ) {
        setErro("Este e-mail já está cadastrado. Por favor, faça login ou use outro e-mail.");
      } else {
        // Erro genérico para outros casos
        setErro("Ocorreu um erro ao criar a conta. Tente novamente.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="auth-header">
        <h1>Cadastre-se!</h1>
        <p>Crie sua conta para acessar o aplicativo</p>
      </header>

      <form id="register-form" onSubmit={handleSubmit}> 
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Digite seu e-mail" 
            required 
            onChange={handleChange} 
            value={formData.email}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input 
            type="text" 
            id="nome" 
            placeholder="Digite seu nome" 
            required 
            onChange={handleChange} 
            value={formData.nome}
          />
        </div>
        
        {/* CAMPO SENHA */}
        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <div className="password-wrapper">
            <input 
              type={showSenha ? "text" : "password"} 
              id="senha" 
              placeholder="Digite sua senha" 
              required 
              onChange={handleChange} 
              value={formData.senha}
            />
            <button 
              type="button"
              className="btn-toggle-password"
              onClick={() => setShowSenha(!showSenha)}
              aria-label="Mostrar senha"
            >
              <img 
                src={showSenha ? eyeOpenImg : eyeClosedImg} 
                alt="Ver senha" 
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
            </button>
          </div>
        </div>
        
        {/* CAMPO CONFIRMAR SENHA */}
        <div className="form-group">
          <label htmlFor="confirmarSenha">Confirmação de senha</label>
          <div className="password-wrapper">
            <input 
              type={showConfirmarSenha ? "text" : "password"} 
              id="confirmarSenha" 
              placeholder="Confirme sua senha" 
              required 
              onChange={handleChange} 
              value={formData.confirmarSenha}
            />
            <button 
              type="button"
              className="btn-toggle-password"
              onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              aria-label="Mostrar confirmação de senha"
            >
              <img 
                src={showConfirmarSenha ? eyeOpenImg : eyeClosedImg} 
                alt="Ver senha" 
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
            </button>
          </div>
        </div>
        
        {erro && (
          <div className="alert-error">
            {erro}
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastre-se'}
        </button>
      </form>
      
      <Link to="/login" className="auth-link">
        Já tenho cadastro
      </Link>
    </>
  );
};

export default Cadastro;
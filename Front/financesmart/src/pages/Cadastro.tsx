import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { api } from '../services/api';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
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
      // Chamada à API de registo
      await api.register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });
      
      alert("Cadastro realizado com sucesso! Faça login.");
      navigate('/login'); 
    } catch (err: any) {
      console.error(err);
      setErro(err.message || "Erro ao criar conta.");
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
          <input type="email" id="email" placeholder="Digite seu e-mail" required onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input type="text" id="nome" placeholder="Digite seu nome" required onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input type="password" id="senha" placeholder="Digite sua senha" required onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label htmlFor="password-confirm">Confirmação de senha</label>
          <input type="password" id="confirmarSenha" placeholder="Confirme sua senha" required onChange={handleChange} />
        </div>
        
        {erro && <p style={{ color: 'var(--color-negative)', marginBottom: '10px' }}>{erro}</p>}

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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const EsqueciSenha: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chama a rota que envia o e-mail (configurada no backend)
      await api.requestPasswordReset(email);
      
      alert('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
      navigate('/login'); // Volta para o login após o envio
    } catch (error) {
      console.error("Erro ao solicitar reset:", error);
      // Mesmo com erro, por segurança, muitas vezes mostramos a mesma mensagem
      // Mas aqui vamos alertar para facilitar o teste
      alert('Erro ao processar solicitação. Verifique o e-mail ou tente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="auth-header">
        <h1>Recuperar Senha</h1>
        <p>Informe seu e-mail para receber o link de redefinição.</p>
      </header>

      <form id="forgot-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Digite seu e-mail cadastrado" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Link'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/login" className="auth-link" style={{ marginTop: 0 }}>
          Voltar para o Login
        </Link>
      </div>
    </>
  );
};

export default EsqueciSenha;
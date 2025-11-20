import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

const AlterarSenha: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook para ler a URL
  
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Captura o token da URL (ex: http://.../reset-password?token=XYZ...)
  const token = searchParams.get('token');

  // Verifica se o token existe ao carregar a página
  useEffect(() => {
    if (!token) {
      setErro('Link inválido ou expirado. Por favor, solicite uma nova redefinição.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!token) {
      setErro('Token de segurança não encontrado.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Chama a API real para atualizar a senha no banco
      await api.confirmPasswordReset(token, novaSenha);
      
      alert('Sua senha foi alterada com sucesso! Agora você pode fazer login.');
      navigate('/login'); 
    } catch (err: any) {
      console.error(err);
      setErro(err.message || 'Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="auth-header">
        <h1>Definir Nova Senha</h1>
        <p>Insira sua nova senha abaixo.</p>
      </header>

      <form id="reset-password-form" onSubmit={handleSubmit}>
        
        {/* Campo para Nova Senha */}
        <div className="form-group">
          <label htmlFor="new-password">Nova Senha</label>
          <input 
            type="password" 
            id="new-password" 
            placeholder="Digite a nova senha" 
            required 
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            disabled={!token} // Desabilita se não houver token
          />
        </div>
        
        {/* Campo de Confirmação */}
        <div className="form-group">
          <label htmlFor="password-confirm">Confirmação da Nova Senha</label>
          <input 
            type="password" 
            id="password-confirm" 
            placeholder="Confirme a nova senha" 
            required 
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={!token}
          />
        </div>
        
        {/* Mensagem de Erro */}
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

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || !token}
        >
          {loading ? 'Alterando...' : 'Alterar Senha'}
        </button>
      </form>
      
      <Link to="/login" className="auth-link">
        Voltar para o Login
      </Link>
    </>
  );
};

export default AlterarSenha;
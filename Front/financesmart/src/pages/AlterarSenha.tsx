import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Link e useNavigate devem estar aqui

const AlterarSenha: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica real de recuperação/alteração de senha iria aqui.
    console.log("Tentativa de alteração de senha...");
    
    // Após sucesso, redireciona para o Login
    alert('Sua senha foi alterada com sucesso!');
    navigate('/login'); // <-- Redirecionamento 1 (Após sucesso)
  };

  return (
    <>
      <header className="auth-header">
        <h1>Alterar Senha</h1>
        <p>Insira seu e-mail e a nova senha para redefinição.</p>
      </header>

      <form id="reset-password-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="Seu e-mail cadastrado" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="new-password">Nova Senha</label>
          <input type="password" id="new-password" placeholder="Digite a nova senha" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password-confirm">Confirmação da Nova Senha</label>
          <input type="password" id="password-confirm" placeholder="Confirme a nova senha" required />
        </div>
        
        <button type="submit" className="btn-primary">Alterar Senha</button>
      </form>
      
      {/* Redirecionamento 2 (Link na parte inferior) */}
      <Link to="/login" className="auth-link">
        Lembrei minha senha!
      </Link>
    </>
  );
};

export default AlterarSenha;
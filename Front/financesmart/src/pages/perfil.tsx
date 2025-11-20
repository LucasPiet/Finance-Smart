import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Perfil: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar dados ao abrir a página
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const dados = await api.getProfile();
        setNome(dados.nome);
        setEmail(dados.email);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert("Não foi possível carregar os seus dados.");
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.updateProfile(nome, email);
      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando informações...</div>;

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Meus Dados</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Atualize as suas informações pessoais</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input 
            type="text" 
            id="nome" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default Perfil;
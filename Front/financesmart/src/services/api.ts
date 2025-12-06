// src/services/api.ts

// DICA: Se estiver rodando no Docker, 'localhost' pode não funcionar.
// Considere usar variáveis de ambiente ou o nome do serviço (ex: http://backend_auth:8001)
const AUTH_URL = 'http://localhost:8001';
const TRANSACOES_URL = 'http://localhost:8002';

export const api = {
  request: async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro na requisição: ${response.status}`);
      }
      
      if (response.status === 204) return null;

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // ==========================
  //       AUTENTICAÇÃO
  // ==========================
  
  login: (body: { email: string; senha: string }) => 
    api.request(`${AUTH_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  register: (body: { nome: string; email: string; senha: string }) => 
    api.request(`${AUTH_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  requestPasswordReset: (email: string) => 
    api.request(`${AUTH_URL}/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  confirmPasswordReset: (token: string, nova_senha: string) => 
    api.request(`${AUTH_URL}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, nova_senha }),
    }),

  // ==========================
  //    GESTÃO DE USUÁRIO
  // ==========================

  getProfile: () => 
    api.request(`${AUTH_URL}/user/me`),

  updateProfile: (nome: string, email: string) => 
    api.request(`${AUTH_URL}/user/me`, {
      method: 'PUT',
      body: JSON.stringify({ nome, email }),
    }),

  deleteAccount: () => 
    api.request(`${AUTH_URL}/user/me`, {
      method: 'DELETE',
    }),

  // ==========================
  //       TRANSAÇÕES
  // ==========================

  // ALTERAÇÃO: Adicionado suporte para filtros de mês e ano
  getSaldo: (mes?: number, ano?: number) => {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (ano) params.append('ano', ano.toString());
    
    // Constrói a URL: ex: .../saldo?mes=4&ano=2025
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return api.request(`${TRANSACOES_URL}/saldo${queryString}`);
  },

  // ALTERAÇÃO: Adicionado suporte para filtros de mês, ano e tipo
  getTransacoes: (mes?: number, ano?: number, tipo?: string) => {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (ano) params.append('ano', ano.toString());
    if (tipo) params.append('tipo', tipo);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return api.request(`${TRANSACOES_URL}/transacoes${queryString}`);
  },

  criarTransacao: (body: { tipo: 'C' | 'D'; categoria: string; descricao: string; valor: number; data?: string }) => 
    api.request(`${TRANSACOES_URL}/transacoes`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  deleteTransacao: (id: number) => 
    api.request(`${TRANSACOES_URL}/transacoes/${id}`, {
      method: 'DELETE',
    }),

  updateTransacao: (id: number, body: { tipo: 'C' | 'D'; categoria: string; descricao: string; valor: number }) => 
    api.request(`${TRANSACOES_URL}/transacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
};
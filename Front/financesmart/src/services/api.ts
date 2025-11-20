// src/services/api.ts

// URLs base dos serviços (ajuste se necessário, ex: portas docker ou IP real)
const AUTH_URL = 'http://localhost:8001';
const TRANSACOES_URL = 'http://localhost:8002';

export const api = {
  // Função genérica para centralizar pedidos, headers e tratamento de erros
  request: async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      // Adiciona o token JWT se ele existir no armazenamento
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      // Se a resposta não for bem-sucedida (200-299), tenta extrair a mensagem de erro
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro na requisição: ${response.status}`);
      }
      
      // Para respostas sem corpo (ex: 204 No Content), retorna null
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

  // Passo 1: Solicitar link por e-mail
  requestPasswordReset: (email: string) => 
    api.request(`${AUTH_URL}/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Passo 2: Redefinir senha com o token recebido
  confirmPasswordReset: (token: string, nova_senha: string) => 
    api.request(`${AUTH_URL}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, nova_senha }),
    }),

  // ==========================
  //    GESTÃO DE USUÁRIO
  // ==========================

  // Buscar dados do perfil (Nome, Email)
  getProfile: () => 
    api.request(`${AUTH_URL}/user/me`),

  // Atualizar dados do perfil
  updateProfile: (nome: string, email: string) => 
    api.request(`${AUTH_URL}/user/me`, {
      method: 'PUT',
      body: JSON.stringify({ nome, email }),
    }),

  // Apagar a conta do utilizador logado
  deleteAccount: () => 
    api.request(`${AUTH_URL}/user/me`, {
      method: 'DELETE',
    }),

  // ==========================
  //       TRANSAÇÕES
  // ==========================

  // Obter resumo financeiro (Saldo, Receitas, Despesas)
  getSaldo: () => 
    api.request(`${TRANSACOES_URL}/saldo`),

  // Listar todas as transações do utilizador
  getTransacoes: () => 
    api.request(`${TRANSACOES_URL}/transacoes`),

  // Criar nova transação
  criarTransacao: (body: { tipo: 'C' | 'D'; categoria: string; descricao: string; valor: number }) => 
    api.request(`${TRANSACOES_URL}/transacoes`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Deletar transação por ID
  deleteTransacao: (id: number) => 
    api.request(`${TRANSACOES_URL}/transacoes/${id}`, {
      method: 'DELETE',
    }),

  // Atualizar transação existente
  updateTransacao: (id: number, body: { tipo: 'C' | 'D'; categoria: string; descricao: string; valor: number }) => 
    api.request(`${TRANSACOES_URL}/transacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
};
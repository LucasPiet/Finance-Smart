import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Importação dos Layouts
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { FormLayout } from '../components/layout/FormLayout';

// Importação das Páginas (Lazy Loading para otimização)
const Login = lazy(() => import('../pages/Login'));
const Cadastro = lazy(() => import('../pages/Cadastro'));
const EsqueciSenha = lazy(() => import('../pages/EsqueciSenha')); // Nova página de solicitação
const AlterarSenha = lazy(() => import('../pages/AlterarSenha')); // Página de reset de senha
const Todos = lazy(() => import('../pages/Dashboard/Todos'));
const Receitas = lazy(() => import('../pages/Dashboard/Receitas'));
const Despesas = lazy(() => import('../pages/Dashboard/Despesas'));
const NovoLancamento = lazy(() => import('../pages/NovoLancamento'));
const SobreNos = lazy(() => import('../pages/SobreNos'));
const Perfil = lazy(() => import('../pages/perfil')); // Nova página de Perfil

// Componente de Loading simples enquanto as páginas carregam
const Loading: React.FC = () => <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;

// --- Componente de Proteção de Rota ---
// Verifica se existe um token. Se não, bloqueia o acesso.
const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  
  // Se não tiver token, redireciona para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se tiver token, permite o acesso às rotas filhas
  return <Outlet />;
};

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        
        {/* Redirecionamento da raiz para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* --- Rotas Públicas (Autenticação) --- */}
        {/* Usam o AuthLayout (Card centralizado) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          
          {/* Rota para redefinição vinda do e-mail */}
          <Route path="/reset-password" element={<AlterarSenha />} />
          
          {/* Rota legada para acesso direto (opcional, pode manter ambas) */}
          <Route path="/alterar-senha" element={<AlterarSenha />} /> 
        </Route>

        {/* --- INICIO DAS ROTAS PROTEGIDAS --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* Rotas do Painel Principal (Com Menu Inferior e Navegação por Mês) */}
          <Route path="/dashboard" element={<AppLayout />}>
            <Route index element={<Todos />} /> 
            <Route path="receitas" element={<Receitas />} />
            <Route path="despesas" element={<Despesas />} />
          </Route>

          {/* Rotas de Formulários e Informações (Com Cabeçalho 'Voltar') */}
          <Route element={<FormLayout />}>
            <Route path="/novo-lancamento" element={<NovoLancamento />} />
            <Route path="/sobre-nos" element={<SobreNos />} /> 
            <Route path="/perfil" element={<Perfil />} /> {/* Rota para edição de perfil */}
          </Route>

        </Route>
        {/* --- FIM DAS ROTAS PROTEGIDAS --- */}
        
        {/* Rota para qualquer URL desconhecida (404) */}
        <Route path="*" element={<div style={{ padding: '20px' }}><h1>404 | Página não encontrada</h1></div>} />
      </Routes>
    </Suspense>
  );
};
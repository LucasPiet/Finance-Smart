import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { FormLayout } from '../components/layout/FormLayout';

// Páginas (Lazy Loading)
const Login = lazy(() => import('../pages/Login'));
const Cadastro = lazy(() => import('../pages/Cadastro'));
const AlterarSenha = lazy(() => import('../pages/AlterarSenha'));
const Todos = lazy(() => import('../pages/Dashboard/Todos'));
const Receitas = lazy(() => import('../pages/Dashboard/Receitas'));
const Despesas = lazy(() => import('../pages/Dashboard/Despesas'));
const NovoLancamento = lazy(() => import('../pages/NovoLancamento'));
const SobreNos = lazy(() => import('../pages/SobreNos')); // <--- Importe aqui

const Loading: React.FC = () => <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas de Autenticação */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/alterar-senha" element={<AlterarSenha />} /> 
        </Route>

        {/* Rotas do Painel Principal */}
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Todos />} /> 
          <Route path="receitas" element={<Receitas />} />
          <Route path="despesas" element={<Despesas />} />
        </Route>

        {/* Rotas com Layout de Formulário (Cabeçalho com 'Voltar') */}
        <Route element={<FormLayout />}>
          <Route path="/novo-lancamento" element={<NovoLancamento />} />
          {/* Adicione a rota aqui para ganhar o botão de voltar automaticamente */}
          <Route path="/sobre-nos" element={<SobreNos />} /> 
        </Route>
        
        <Route path="*" element={<div style={{ padding: '20px' }}><h1>404 | Página não encontrada</h1></div>} />
      </Routes>
    </Suspense>
  );
};
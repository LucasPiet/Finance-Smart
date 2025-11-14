import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppLayout } from '../components/layout/AppLayout';
import { FormLayout } from '../components/layout/FormLayout';

// Páginas (usando Lazy Loading para melhor performance)
const Login = lazy(() => import('../pages/Login'));
const Cadastro = lazy(() => import('../pages/Cadastro'));
const Todos = lazy(() => import('../pages/Dashboard/Todos'));
const Receitas = lazy(() => import('../pages/Dashboard/Receitas'));
const Despesas = lazy(() => import('../pages/Dashboard/Despesas'));
const NovoLancamento = lazy(() => import('../pages/NovoLancamento'));

// fallback para o Suspense
const Loading: React.FC = () => <div>Carregando...</div>;

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        
        {/*Layout de Autenticação */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>

        {/*Layout Principal do App (Dashboard) */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Todos />} /> {/* 'index' significa a rota padrão para "/" */}
          <Route path="receitas" element={<Receitas />} />
          <Route path="despesas" element={<Despesas />} />
        </Route>

        {/* Rota 3: Layout de Formulário */}
        <Route element={<FormLayout />}>
          <Route path="/novo-lancamento" element={<NovoLancamento />} />
        </Route>
        
        {/* TODO: Adicionar uma rota "NotFound" (404) */}
        
      </Routes>
    </Suspense>
  );
};
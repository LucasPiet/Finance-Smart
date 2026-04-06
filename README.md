# 💰 Finance Smart

Sistema de gestão financeira baseado em **arquitetura de microserviços**, desenvolvido com **FastAPI**, com foco em escalabilidade, separação de responsabilidades e simulação de ambiente real de produção.

---

## 📌 Overview

O **Finance Smart** é uma aplicação backend que permite o gerenciamento de receitas e despesas de usuários, utilizando serviços independentes para autenticação e controle financeiro.

O projeto foi desenvolvido com foco em:
- Arquitetura de microserviços
- APIs REST performáticas com FastAPI
- Conteinerização com Docker
- Persistência de dados com banco relacional
- Boas práticas de engenharia de software

---

## 🏗️ Arquitetura

O sistema é dividido em serviços independentes:

- **Auth Service**
  - Responsável pela autenticação de usuários
  - Preparado para uso com JWT

- **Transaction Service**
  - Gerencia receitas e despesas
  - Responsável pelo controle de saldo

- **Database**
  - Banco relacional
  - Uso de triggers para garantir consistência do saldo

---

## ⚙️ Tecnologias Utilizadas

- **Backend:** FastAPI (Python)
- **Banco de Dados:** SQL (relacional)
- **Containerização:** Docker / Docker Compose
- **Comunicação:** REST APIs (HTTP/JSON)
- **Versionamento:** Git

---

## 🔥 Decisões Técnicas

- **FastAPI**
  - Alta performance
  - Tipagem com Pydantic
  - Documentação automática (Swagger/OpenAPI)

- **Microserviços**
  - Separação de responsabilidades
  - Possibilidade de escalar serviços individualmente

- **Triggers no Banco**
  - Garantia de consistência do saldo independentemente da aplicação

- **Docker**
  - Ambiente isolado e replicável
  - Simulação de cenário de produção

---

## ▶️ Como Executar o Projeto

### Pré-requisitos
- Docker
- Docker Compose

### Passos

```bash
git clone https://github.com/LucasPiet/Finance-Smart.git
cd Finance-Smart
docker-compose up --build

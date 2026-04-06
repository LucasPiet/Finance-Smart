# 💰 Finance Smart

Sistema de gestão financeira baseado em **arquitetura de microserviços**, desenvolvido com foco em escalabilidade, separação de responsabilidades e simulação de ambiente real de produção.

---

## 📌 Overview

O **Finance Smart** é uma aplicação que permite o controle de receitas e despesas de usuários, utilizando serviços independentes para autenticação e gerenciamento financeiro.

O projeto foi desenvolvido com o objetivo de aplicar conceitos modernos de engenharia de software, incluindo:
- Arquitetura de microserviços
- APIs REST
- Conteinerização com Docker
- Manipulação de dados com SQL

---

## 🏗️ Arquitetura

O sistema é dividido em múltiplos serviços independentes:

- **Auth Service**
  - Responsável por autenticação e gerenciamento de usuários
  - (Preparado para uso com JWT)

- **Transaction Service**
  - Gerencia receitas e despesas
  - Controle de saldo do usuário

- **Banco de Dados**
  - Banco relacional
  - Uso de **triggers** para cálculo automático de saldo

---

## ⚙️ Tecnologias Utilizadas

- **Linguagem:** Python  
- **Banco de Dados:** SQL (relacional)  
- **Containerização:** Docker  
- **Arquitetura:** Microservices  
- **Comunicação:** REST APIs (HTTP/JSON)  
- **Controle de versão:** Git  

---

## 🔥 Decisões Técnicas

- **Microserviços**  
  Separação entre autenticação e regras de negócio para permitir escalabilidade e manutenção independente.

- **Uso de Triggers no Banco**  
  Garantia de consistência do saldo independentemente da aplicação.

- **APIs REST**  
  Comunicação simples, padronizada e desacoplada entre serviços.

- **Docker**  
  Facilita execução em qualquer ambiente e simula cenário real de deploy.

---

## ▶️ Como Executar o Projeto

### Pré-requisitos
- Docker instalado
- Docker Compose

### Passos

```bash
# Clonar o repositório
git clone https://github.com/LucasPiet/Finance-Smart

# Entrar na pasta
cd Finance-Smart

# Subir os serviços
docker-compose up --build

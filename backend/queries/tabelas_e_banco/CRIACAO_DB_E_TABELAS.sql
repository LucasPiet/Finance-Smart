USE master;
GO

IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'FINANCE_SMART')
BEGIN
    CREATE DATABASE FINANCE_SMART;
END
GO

USE FINANCE_SMART;
GO


CREATE TABLE USUARIOS (
    ID INT IDENTITY(1,1) PRIMARY KEY,                  -- Identificador único do usuário
    NOME NVARCHAR(150) NOT NULL,                       -- Nome completo do usuário
    EMAIL NVARCHAR(255) NOT NULL UNIQUE,               -- E-mail único para login
    SENHA NVARCHAR(255) NOT NULL,                  -- Hash Argon2id da senha
    ATIVO BIT DEFAULT 1,                               -- Flag para ativar/desativar usuário
    CRIACAO DATETIME2 DEFAULT SYSUTCDATETIME(),       -- Data/hora de criação (UTC)
    ATUALIZADO DATETIME2 NULL                        -- Data/hora da última atualização
);


CREATE TABLE TRANSACOES (
    ID INT IDENTITY(1,1) PRIMARY KEY,                 -- Identificador único da transação
    USUARIO_ID INT NOT NULL,                          -- Relacionamento com o usuário
    TIPO CHAR(1) CHECK (TIPO IN ('C', 'D')) NOT NULL, -- 'C' = Crédito, 'D' = Débito
    CATEGORIA NVARCHAR(100) NOT NULL,                 -- Ex: 'Salário', 'Aluguel', 'Alimentação'
    DESCRICAO NVARCHAR(255) NULL,                     -- Descrição opcional
    VALOR DECIMAL(18,2) NOT NULL,                     -- Valor da transação
    DATA_TRANSACAO DATETIME2 DEFAULT SYSUTCDATETIME(),-- Data da transação
    CRIACAO DATETIME2 DEFAULT SYSUTCDATETIME(),       -- Registro de criação
    FOREIGN KEY (USUARIO_ID) REFERENCES USUARIOS(ID)
);

CREATE TABLE SALDOS (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    USUARIO_ID INT NOT NULL UNIQUE,                 -- Garante apenas um saldo por usuário
    SALDO DECIMAL(18,2) NOT NULL DEFAULT 0,   -- Saldo acumulado
    ATUALIZADO_EM DATETIME2 DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (USUARIO_ID) REFERENCES USUARIOS(ID)
);

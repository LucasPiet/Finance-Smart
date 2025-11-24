#!/bin/bash
echo "⏳ Aguardando o SQL Server iniciar..."
# Espera 30 segundos para garantir que o SQL Server subiu (método simples e eficaz)
sleep 30

echo "🚀 Rodando script de Criação de Tabelas..."
/opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Smart123 -i /tmp/queries/tabelas_e_banco/CRIACAO_DB_E_TABELAS.sql

echo "🚀 Rodando script de Triggers..."
/opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Smart123 -d FINANCE_SMART -i /tmp/queries/triggers/TR_GERENCIA_SALDO.sql

echo "✅ Banco de dados configurado com sucesso!"

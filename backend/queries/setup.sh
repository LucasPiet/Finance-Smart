#!/bin/bash

echo "⏳ Aguardando o SQL Server ficar pronto (Tentativa de conexão)..."

# Loop de verificação: Tenta conectar a cada 2 segundos, por até 60 segundos
for i in {1..30};
do
    /opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P Smart123 -C -Q "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]
    then
        echo "✅ SQL Server respondeu! Iniciando migração..."
        break
    else
        echo "💤 Banco ainda indisponível... tentando novamente em 2s"
        sleep 2
    fi
done

# Agora que o banco respondeu, rodamos os scripts com segurança
echo "🚀 Rodando script de Criação de Tabelas..."
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P Smart123 -C -i /tmp/queries/tabelas_e_banco/CRIACAO_DB_E_TABELAS.sql

echo "🚀 Rodando script de Triggers..."
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P Smart123 -C -d FINANCE_SMART -i /tmp/queries/triggers/TR_GERENCIA_SALDO.sql

echo "✅ Banco de dados configurado com sucesso!"

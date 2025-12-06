#!/bin/bash

# Aguarda o SQL Server estar pronto
echo "A aguardar o SQL Server iniciar..."
until /opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "Smart123" -C -Q "SELECT 1" &> /dev/null
do
  echo "SQL Server indisponível, a tentar novamente em 5 segundos..."
  sleep 5
done

echo "SQL Server está online!"

# 1. Cria Base de Dados e Tabelas
echo ">>> A criar Base de Dados e Tabelas..."
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "Smart123" -C -i /usr/src/app/init.sql

# 2. Cria Triggers (Só executa se o anterior não falhar catastroficamente, mas o sqlcmd geralmente continua)
echo ">>> A criar Triggers..."
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "Smart123" -C -i /usr/src/app/triggers.sql

echo ">>> Inicialização da Base de Dados concluída!"

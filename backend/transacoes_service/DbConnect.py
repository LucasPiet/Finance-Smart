import os
import pyodbc

class ConnDataBase:
    def __init__(self):
        # Nome do serviço do SQL Server no Docker Compose
        self.server = os.getenv("DB_HOST", "sqlserver")
        self.database = os.getenv("DB_NAME", "FINANCE_SMART")
        self.username = os.getenv("DB_USER", "sa")
        self.password = os.getenv("DB_PASSWORD", "Smart123")

        try:
            self.conn = pyodbc.connect(
            f"DRIVER={{ODBC Driver 18 for SQL Server}};"
            f"SERVER={self.server};"
            f"DATABASE={self.database};"
            f"UID={self.username};"
            f"PWD={self.password};"
            "TrustServerCertificate=yes;"
        )

            self.cursor = self.conn.cursor()
            print(f"✅ Conectado ao banco '{self.database}' ({self.server})")

        except Exception as e:
            print(f"❌ Erro ao conectar ao banco: {e}")
            raise

    def fechar(self):
        try:
            self.cursor.close()
            self.conn.close()
            print("🔌 Conexão encerrada.")
        except:
            print("⚠️ Erro ao encerrar conexão.")
            
   

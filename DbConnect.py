import pyodbc

class ConnDataBase:
    def __init__(self, ip_servidor='127.0.0.1', database='FINANCE_SMART'):
        self.server = ip_servidor
        self.database = database
        self.username = 'FinanceSmart'
        self.password = 'Smart123'

        try:
            self.conn = pyodbc.connect(
                f'DRIVER={{SQL Server}};'
                f'SERVER={self.server};'
                f'DATABASE={self.database};'
                f'UID={self.username};'
                f'PWD={self.password}'
            )
            self.cursor = self.conn.cursor()
            print(f"✅ Conectado com sucesso ao banco '{self.database}' no IP: {self.server}")
        except Exception as e:
            print(f"❌ Erro ao conectar ao banco '{self.database}' ({self.server}): {e}")
            raise

    def fechar(self):
        try:
            self.cursor.close()
            self.conn.close()
            print("✅ Conexão com o banco encerrada.")
        except:
            print("⚠️ Erro ao fechar a conexão com o banco.")

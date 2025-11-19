from DbConnect import ConnDataBase

def inserir_transacao(user_id, tipo, categoria, descricao, valor):
    db = ConnDataBase()

    try:
        # Cria tabela temporária para capturar ID
        db.cursor.execute("""
            CREATE TABLE #TempID (ID INT);
        """)

        # Inserção com OUTPUT para a tabela temporária
        db.cursor.execute("""
            INSERT INTO TRANSACOES (USUARIO_ID, TIPO, CATEGORIA, DESCRICAO, VALOR)
            OUTPUT INSERTED.ID INTO #TempID
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, tipo, categoria, descricao, valor))

        # Pega o ID gerado
        db.cursor.execute("SELECT ID FROM #TempID")
        resultado = db.cursor.fetchone()

        db.conn.commit()

        if resultado is None or resultado[0] is None:
            print("❌ Não foi possível obter o ID da transação.")
            return None

        return int(resultado[0])

    except Exception as e:
        print("❌ Erro ao inserir transação:", e)
        return None

    finally:
        db.fechar()

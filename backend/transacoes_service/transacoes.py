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

def listar_transacoes(user_id):
    db = ConnDataBase()
    try:
        db.cursor.execute("""
            SELECT ID, TIPO, CATEGORIA, DESCRICAO, VALOR, DATA_TRANSACAO
            FROM TRANSACOES
            WHERE USUARIO_ID = ?
            ORDER BY DATA_TRANSACAO DESC
        """, (user_id,))
        
        # Transforma os resultados em dicionário com chaves minúsculas
        columns = [column[0].lower() for column in db.cursor.description]
        results = []
        for row in db.cursor.fetchall():
            results.append(dict(zip(columns, row)))
            
        return results

    except Exception as e:
        print(f"❌ Erro ao listar transações: {e}")
        return []

    finally:
        db.fechar()

def obter_resumo(user_id):
    db = ConnDataBase()
    try:
        db.cursor.execute("""
            SELECT 
                SUM(CASE WHEN TIPO = 'C' THEN VALOR ELSE 0 END) AS RECEITAS,
                SUM(CASE WHEN TIPO = 'D' THEN VALOR ELSE 0 END) AS DESPESAS
            FROM TRANSACOES
            WHERE USUARIO_ID = ?
        """, (user_id,))
        
        row = db.cursor.fetchone()
        
        receitas = float(row[0]) if row and row[0] else 0.0
        despesas = float(row[1]) if row and row[1] else 0.0
        saldo = receitas - despesas

        return {
            "saldo": saldo,
            "receitas": receitas,
            "despesas": despesas
        }

    except Exception as e:
        print(f"❌ Erro ao obter resumo: {e}")
        return {"saldo": 0.0, "receitas": 0.0, "despesas": 0.0}

    finally:
        db.fechar()

def deletar_transacao(id_transacao, user_id):
    db = ConnDataBase()
    try:
        db.cursor.execute("""
            DELETE FROM TRANSACOES 
            WHERE ID = ? AND USUARIO_ID = ?
        """, (id_transacao, user_id))
        
        db.conn.commit()
        
        return db.cursor.rowcount > 0

    except Exception as e:
        print(f"❌ Erro ao deletar: {e}")
        return False
    finally:
        db.fechar()

def atualizar_transacao(id_transacao, user_id, tipo, categoria, descricao, valor):
    db = ConnDataBase()
    try:
        # CORREÇÃO: Removida a coluna 'ATUALIZADO' que não existe na tabela TRANSACOES
        db.cursor.execute("""
            UPDATE TRANSACOES
            SET TIPO = ?, CATEGORIA = ?, DESCRICAO = ?, VALOR = ?
            WHERE ID = ? AND USUARIO_ID = ?
        """, (tipo, categoria, descricao, valor, id_transacao, user_id))
        
        db.conn.commit()
        
        # Se rowcount > 0, significa que encontrou e atualizou a linha com sucesso
        return db.cursor.rowcount > 0

    except Exception as e:
        print(f"❌ Erro ao atualizar: {e}")
        return False
    finally:
        db.fechar()
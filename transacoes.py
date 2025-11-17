from DbConnect import ConnDataBase

def inserir_transacao(user_id, tipo, categoria, descricao, valor):
    db = ConnDataBase()

    try:
        db.cursor.execute("""
            INSERT INTO TRANSACOES (USUARIO_ID, TIPO, CATEGORIA, DESCRICAO, VALOR)
            OUTPUT INSERTED.ID
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, tipo, categoria, descricao, valor))

        novo_id = db.cursor.fetchone()[0]
        db.conn.commit()
        return novo_id

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

        dados = db.cursor.fetchall()

        return [
            {
                "id": d.ID,
                "tipo": d.TIPO,
                "categoria": d.CATEGORIA,
                "descricao": d.DESCRICAO,
                "valor": float(d.VALOR),
                "data": str(d.DATA_TRANSACAO)
            }
            for d in dados
        ]

    finally:
        db.fechar()


def saldo(user_id):
    db = ConnDataBase()

    try:
        db.cursor.execute("""
            SELECT
                (SELECT COALESCE(SUM(valor), 0) FROM TRANSACOES WHERE usuario_id = ? AND tipo = 'C') -
                (SELECT COALESCE(SUM(valor), 0) FROM TRANSACOES WHERE usuario_id = ? AND tipo = 'D')
        """, (user_id, user_id))

        r = db.cursor.fetchone()[0]
        return float(r)

    finally:
        db.fechar()

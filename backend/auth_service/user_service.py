import pyodbc
from DbConnect import ConnDataBase
from argon2 import PasswordHasher

ph = PasswordHasher()

def cadastrar_usuario(nome, email, senha):
    db = None
    try:
        db = ConnDataBase()

        hashed = ph.hash(senha)

        db.cursor.execute("""
            INSERT INTO USUARIOS (NOME, EMAIL, SENHA)
            VALUES (?, ?, ?)
        """, (nome, email, hashed))

        db.conn.commit()
        return True

    except pyodbc.Error as e:
        return str(e)

    finally:
        if db:
            db.fechar()


def login_usuario(email, senha):
    db = None
    try:
        db = ConnDataBase()

        db.cursor.execute("""
            SELECT ID, SENHA 
            FROM USUARIOS 
            WHERE EMAIL = ?
        """, (email,))
        row = db.cursor.fetchone()

        if not row:
            return None  # usuário não existe

        user_id = row[0]
        senha_hash = row[1]

        try:
            ph.verify(senha_hash, senha)
        except Exception:
            return None

        return {"id": user_id, "email": email}

    finally:
        if db:
            db.fechar()


def buscar_usuario_por_email(email):
    db = None
    try:
        db = ConnDataBase()

        db.cursor.execute("""
            SELECT ID, EMAIL, SENHA
            FROM USUARIOS
            WHERE EMAIL = ?
        """, (email,))

        row = db.cursor.fetchone()

        if not row:
            return None

        return {
            "id": row[0],
            "email": row[1],
            "senha": row[2]
        }

    finally:
        if db:
            db.fechar()


def atualizar_senha(user_id, nova_senha):
    db = None
    try:
        db = ConnDataBase()

        hashed = ph.hash(nova_senha)

        db.cursor.execute("""
            UPDATE USUARIOS
            SET SENHA = ?, ATUALIZADO = SYSUTCDATETIME()
            WHERE ID = ?
        """, (hashed, user_id))

        db.conn.commit()
        return True

    except pyodbc.Error as e:
        return str(e)

    finally:
        if db:
            db.fechar()

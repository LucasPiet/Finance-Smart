from argon2 import PasswordHasher
from DbConnect import ConnDataBase

ph = PasswordHasher()

def cadastrar_usuario(nome, email, senha):
    db = ConnDataBase()  # ✅ agora não precisa passar IP
    hash_senha = ph.hash(senha)

    try:
        db.cursor.execute("""
            INSERT INTO USUARIOS (NOME, EMAIL, SENHA)
            VALUES (?, ?, ?)
        """, (nome, email, hash_senha))
        db.conn.commit()
        print(f"✅ Usuário '{nome}' cadastrado com sucesso!")

    except Exception as e:
        print(f"❌ Erro ao cadastrar usuário: {e}")

    finally:
        db.fechar()


def autenticar_usuario(email, senha):
    db = ConnDataBase()

    try:
        db.cursor.execute("SELECT SENHA FROM USUARIOS WHERE EMAIL = ?", (email,))
        row = db.cursor.fetchone()

        if not row:
            print("❌ Usuário não encontrado.")
            return False

        senha_hash = row[0]
        ph.verify(senha_hash, senha)
        print("✅ Login bem-sucedido!")
        return True

    except Exception as e:
        print(f"❌ Senha incorreta ou erro: {e}")
        return False

    finally:
        db.fechar()


if __name__ == "__main__":
    cadastrar_usuario("Kaue Breno", "cliente2@teste.com", "minhaSenhaForte123")
    autenticar_usuario("cliente2@teste.com", "minhaSenhaForte123")

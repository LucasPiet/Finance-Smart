from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from user_service import cadastrar_usuario, login_usuario
from jwt_utils import gerar_jwt, gerar_token_reset, validar_jwt_reset,validar_jwt
from user_service import cadastrar_usuario, login_usuario, buscar_usuario_por_email

import requests

app = FastAPI(title="Auth Service")

class Register(BaseModel):
    nome: str
    email: str
    senha: str

class Login(BaseModel):
    email: str
    senha: str

class ForgotPassword(BaseModel):
    email: str

class ResetPassword(BaseModel):
    token: str
    nova_senha: str


@app.post("/register")
def register_user(body: Register):
    result = cadastrar_usuario(body.nome, body.email, body.senha)
    if result is True:
        return {"status": "ok", "message": "Usuário registrado"}
    else:
        raise HTTPException(400, result)

@app.post("/login")
def login_user(body: Login):
    user = login_usuario(body.email, body.senha)
    if not user:
        raise HTTPException(401, "Credenciais inválidas")

    token = gerar_jwt(user["id"], body.email)
    return {"token": token}

@app.get("/validate-token")
def validate(token: str):
    payload = validar_jwt(token)
    return payload


@app.post("/forgot-password")
def forgot_password(body: ForgotPassword):
    # Verifica se o email existe
    user = buscar_usuario_por_email(body.email)

    if not user:
        raise HTTPException(404, "Email não encontrado")

    # Gera token temporário
    token_reset = gerar_token_reset(user["id"], body.email)

    # Envia email via microserviço
    payload = {
    "destinatario": body.email,
    "assunto": "Redefinir senha",
    "mensagem": f"""
        <h2>Redefinição de senha</h2>
        <p>Clique no link abaixo para definir uma nova senha:</p>
        <a href="http://localhost:8001/reset-password?token={token_reset}">
            Redefinir senha
        </a>
        <p>Esse link expira em 15 minutos.</p>
    """
}


    requests.post("http://localhost:8003/send-email", json=payload)

    return {"status": "ok", "message": "Email enviado"}



@app.post("/reset-password")
def reset_password(body: ResetPassword):
    dados = validar_jwt_reset(body.token)

    if not dados:
        raise HTTPException(400, "Token inválido ou expirado")

    user_id = dados["user_id"]

    from user_service import atualizar_senha
    atualizar_senha(user_id, body.nova_senha)

    return {"status": "ok", "message": "Senha redefinida com sucesso"}


    

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from user_service import cadastrar_usuario, login_usuario
from jwt_utils import gerar_jwt
import requests

app = FastAPI(title="Auth Service")

class Register(BaseModel):
    nome: str
    email: str
    senha: str

class Login(BaseModel):
    email: str
    senha: str

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
    from jwt_utils import validar_jwt
    payload = validar_jwt(token)
    return payload

def enviar_email_reset(email, codigo):
    payload = {
        "destinatario": email,
        "assunto": "Redefinição de senha",
        "mensagem": f"Seu código de redefinição é: {codigo}"
    }

    requests.post("http://localhost:8003/send-email", json=payload)
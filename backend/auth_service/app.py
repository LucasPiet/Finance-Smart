# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from user_service import cadastrar_usuario, login_usuario, buscar_usuario_por_email
from jwt_utils import gerar_jwt, gerar_token_reset, validar_jwt
import requests
import os

app = FastAPI(title="Auth Service")

# URL do email_service dentro do Docker
EMAIL_URL = os.getenv("EMAIL_SERVICE_URL", "http://email_service:8003/send-email")


# ---- MODELS ----
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


# ---- ENDPOINTS ----
@app.post("/register")
def register_user(body: Register):
    result = cadastrar_usuario(body.nome, body.email, body.senha)
    if result is True:
        return {"status": "ok", "message": "Usuário registrado"}
    else:
        raise HTTPException(status_code=400, detail=result)


@app.post("/login")
def login_user(body: Login):
    user = login_usuario(body.email, body.senha)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = gerar_jwt(user["id"], body.email)
    return {"token": token}


@app.get("/validate-token")
def validate_token(token: str):
    payload = validar_jwt(token)
    return payload


@app.post("/forgot-password")
def forgot_password(body: ForgotPassword):
    user = buscar_usuario_por_email(body.email)
    if not user:
        raise HTTPException(status_code=404, detail="Email não encontrado")

    token_reset = gerar_token_reset(user["id"], body.email)

    # Montando email
    mensagem = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333333; text-align: center;">Redefinição de senha</h2>
            <p style="color: #555555; font-size: 16px;">
                Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para definir uma nova senha:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:8001/reset-password?token={token_reset}"
                   style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   Redefinir senha
                </a>
            </div>
            <p style="color: #999999; font-size: 14px; text-align: center;">
                Esse link expira em 15 minutos.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <p style="color: #999999; font-size: 12px; text-align: center;">
                Se você não solicitou esta redefinição, ignore este email.
            </p>
        </div>
    </body>
    </html>
    """

    payload = {
        "destinatario": body.email,
        "assunto": "Redefinição de senha",
        "mensagem": mensagem
    }

    try:
        response = requests.post(EMAIL_URL, json=payload, timeout=10)
        if response.status_code != 200:
            detail = response.json().get("detail", "Erro desconhecido")
            raise HTTPException(status_code=500, detail=f"Erro ao enviar o email: {detail}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Erro ao enviar email: {e}")

    return {"status": "ok", "message": "Email enviado"}


@app.post("/reset-password")
def reset_password(body: ResetPassword):
    payload = validar_jwt(body.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")

    user_id = payload["user_id"]
    result = cadastrar_usuario.atualizar_senha(user_id, body.nova_senha)  # Função fictícia, ajuste conforme seu user_service

    if result:
        return {"status": "ok", "message": "Senha redefinida"}
    else:
        raise HTTPException(status_code=500, detail="Erro ao redefinir senha")
